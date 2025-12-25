'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, CheckCircleIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const applicationSchema = z.object({
  personalStatement: z.string().min(100, 'Personal statement must be at least 100 characters'),
  additionalInfo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function NewApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const courseId = searchParams.get('course');
  const courseName = searchParams.get('courseName');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);

    // Initialize statuses for UI feedback
    setUploadStatus((prev) => {
      const next = { ...prev };
      for (const f of files) {
        next[f.name] = 'pending';
      }
      return next;
    });
  };

  const uploadSupportingDocuments = async (applicationId: string) => {
    if (uploadedFiles.length === 0) return;

    for (const file of uploadedFiles) {
      setUploadStatus((prev) => ({ ...prev, [file.name]: 'uploading' }));

      try {
        const formData = new FormData();
        formData.append('file', file);

        await api.post(`/applications/${applicationId}/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setUploadStatus((prev) => ({ ...prev, [file.name]: 'success' }));
      } catch (_e) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: 'error' }));
        throw new Error(`Failed to upload file: ${file.name}`);
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const file = prev[index];
      if (file) {
        setUploadStatus((s) => {
          const next = { ...s };
          delete next[file.name];
          return next;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    // Create a DRAFT as soon as we have a courseId, so the user can continue even if profile is incomplete.
    const createDraft = async () => {
      if (!courseId) return;

      try {
        const res = await api.post('/applications', {
          courseId,
          submit: false
        });
        setDraftId(res.data?.application?.id || null);
      } catch (_e) {
        // Ignore draft creation errors here; we will show proper errors on final submit.
      }
    };

    createDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!courseId) {
        setSubmitError('Missing course information. Please go back and select a course again.');
        return;
      }

      // Create draft if we don't already have one
      let applicationId = draftId;
      if (!applicationId) {
        const draftRes = await api.post('/applications', {
          courseId,
          submit: false
        });
        applicationId = draftRes.data?.application?.id;
        setDraftId(applicationId || null);
      }

      if (!applicationId) {
        setSubmitError('Failed to create a draft application. Please try again.');
        return;
      }

      // Update draft with the latest form content
      await api.patch(`/applications/${applicationId}`, {
        personalStatement: data.personalStatement,
        additionalInfo: data.additionalInfo
      });

      // Upload documents (optional)
      await uploadSupportingDocuments(applicationId);

      // Final submit: backend enforces profile completion >= 80
      await api.post(`/applications/${applicationId}/submit`);

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/applications');
      }, 1500);
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      // If blocked due to profile completion, redirect user to complete-profile
      if (status === 400 && (data?.requiresProfileCompletion || (data?.blockingReasons || []).includes('PROFILE_INCOMPLETE'))) {
        router.push(`/dashboard/complete-profile?course=${courseId}&courseName=${encodeURIComponent(courseName || '')}`);
        return;
      }

      setSubmitError(data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p>Please log in to continue.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Apply for Course</h1>
            <p className="text-muted-foreground">
              {courseName ? `Application for ${courseName}` : 'Complete your application'}
            </p>
          </div>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-success bg-success/50">
            <CheckCircleIcon className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              Application submitted successfully! Redirecting to your applications...
            </AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        {/* Course Information */}
        {courseName && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Course:</span>
                  <Badge variant="outline">{courseName}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Applicant:</span>
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{user?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="personalStatement">Personal Statement *</Label>
                <Textarea
                  id="personalStatement"
                  {...register('personalStatement')}
                  placeholder="Tell us why you want to join this course and how it aligns with your academic and career goals..."
                  className="mt-1"
                  rows={6}
                />
                {errors.personalStatement && (
                  <p className="mt-1 text-sm text-destructive">{errors.personalStatement.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Minimum 100 characters. Be specific about your interests and goals.
                </p>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  {...register('additionalInfo')}
                  placeholder="Any additional information you'd like to share with the admissions committee..."
                  className="mt-1"
                  rows={4}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional: Include any relevant achievements, experiences, or special circumstances.
                </p>
              </div>

              {/* Document Upload */}
              <div>
                <Label>Supporting Documents</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB each
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => {
                      const status = uploadStatus[file.name] || 'pending';
                      const statusLabel =
                        status === 'pending' ? 'Ready' :
                        status === 'uploading' ? 'Uploading…' :
                        status === 'success' ? 'Uploaded' :
                        'Failed';

                      const statusClass =
                        status === 'success' ? 'text-green-700' :
                        status === 'error' ? 'text-red-700' :
                        status === 'uploading' ? 'text-blue-700' :
                        'text-gray-600';

                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{file.name}</div>
                              <div className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • <span className={statusClass}>{statusLabel}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={status === 'uploading'}
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Declaration */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Declaration</h3>
                <p className="text-sm text-blue-800">
                  By submitting this application, I confirm that all information provided is accurate and complete. 
                  I understand that any false information may result in the rejection of my application.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}

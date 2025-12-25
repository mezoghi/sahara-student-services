'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircleIcon, CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

type ApplicationDetails = {
  id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | string;
  personalStatement: string | null;
  additionalInfo: string | null;
  createdAt?: string;
  submittedAt?: string | null;
  course?: {
    name: string;
    school?: {
      name: string;
    };
  };
  documents: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    uploadedAt: string;
  }>;
};

const statusBadgeVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      return 'default';
    case 'ACCEPTED':
      return 'secondary';
    case 'REJECTED':
      return 'destructive';
    case 'DRAFT':
    default:
      return 'outline';
  }
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const applicationId = params?.id as string | undefined;

  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<{ personalStatement: string; additionalInfo: string }>({
    personalStatement: '',
    additionalInfo: ''
  });

  const isEditable = application?.status === 'DRAFT';

  useEffect(() => {
    if (!applicationId) return;

    const load = async () => {
      try {
        setError(null);
        const res = await api.get(`/applications/${applicationId}`);
        const app = res.data?.application as ApplicationDetails;
        setApplication(app);
        setForm({
          personalStatement: app?.personalStatement || '',
          additionalInfo: app?.additionalInfo || ''
        });
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load application.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [applicationId]);

  const courseTitle = useMemo(() => {
    const courseName = application?.course?.name || 'Course';
    const schoolName = application?.course?.school?.name;
    return schoolName ? `${courseName} • ${schoolName}` : courseName;
  }, [application]);

  const handleSaveDraft = async () => {
    if (!applicationId) return;
    setSaving(true);
    setSuccess(null);

    try {
      await api.patch(`/applications/${applicationId}`, {
        personalStatement: form.personalStatement,
        additionalInfo: form.additionalInfo
      });
      setSuccess('Draft saved successfully.');
      const refreshed = await api.get(`/applications/${applicationId}`);
      setApplication(refreshed.data?.application);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!applicationId) return;

    setUploading(true);
    setSuccess(null);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('file', file);

      await api.post(`/applications/${applicationId}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const refreshed = await api.get(`/applications/${applicationId}`);
      setApplication(refreshed.data?.application);
      setSuccess('Document uploaded successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!applicationId) return;

    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      // Ensure latest draft content is saved before submit
      if (isEditable) {
        await api.patch(`/applications/${applicationId}`, {
          personalStatement: form.personalStatement,
          additionalInfo: form.additionalInfo
        });
      }

      await api.post(`/applications/${applicationId}/submit`);
      setSuccess('Application submitted successfully.');

      const refreshed = await api.get(`/applications/${applicationId}`);
      setApplication(refreshed.data?.application);
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      if (status === 400 && (data?.requiresProfileCompletion || (data?.blockingReasons || []).includes('PROFILE_INCOMPLETE'))) {
        // Redirect user to complete profile, then come back
        router.push(`/dashboard/complete-profile`);
        return;
      }

      setError(data?.error || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-8 text-sm text-muted-foreground">Loading application…</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Application not found.'}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">
              <Link href="/applications" className="underline">My Applications</Link>
            </div>
            <h1 className="text-3xl font-bold text-primary truncate">Application</h1>
            <div className="text-sm text-muted-foreground truncate">{courseTitle}</div>
          </div>
          <Badge variant={statusBadgeVariant(application.status)}>{application.status}</Badge>
        </div>

        {success && (
          <Alert className="border-success bg-success/50">
            <CheckCircleIcon className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="personalStatement">Personal Statement</Label>
              <Textarea
                id="personalStatement"
                value={form.personalStatement}
                onChange={(e) => setForm((p) => ({ ...p, personalStatement: e.target.value }))}
                rows={8}
                disabled={!isEditable}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={form.additionalInfo}
                onChange={(e) => setForm((p) => ({ ...p, additionalInfo: e.target.value }))}
                rows={4}
                disabled={!isEditable}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {isEditable && (
                <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Draft'}
                </Button>
              )}

              {application.status === 'DRAFT' ? (
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              ) : (
                <Button disabled variant="outline">Submitted</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditable && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {uploading ? 'Uploading…' : 'Click to upload'}
                </div>
                <div className="mt-1 text-xs text-gray-500">PDF, JPG, PNG, DOC, DOCX up to 10MB</div>
                <input
                  type="file"
                  className="sr-only"
                  id="file-upload"
                  disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(f);
                    e.currentTarget.value = '';
                  }}
                />
                <label htmlFor="file-upload" className="mt-3 inline-block">
                  <Button type="button" variant="outline" disabled={uploading}>Choose File</Button>
                </label>
              </div>
            )}

            {application.documents.length === 0 ? (
              <div className="text-sm text-muted-foreground">No documents uploaded yet.</div>
            ) : (
              <div className="space-y-2">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded border p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{doc.fileName}</div>
                        <div className="text-xs text-muted-foreground">
                          {doc.fileType} • {new Date(doc.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Stored</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

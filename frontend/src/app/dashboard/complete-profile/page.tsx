'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeftIcon, CheckCircleIcon, AcademicCapIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const profileSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(1, 'Address is required'),
  educationLevel: z.enum(['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD']),
  currentInstitution: z.string().min(1, 'Current institution is required'),
  major: z.string().min(1, 'Major/Field of study is required'),
  gpa: z.string().min(1, 'GPA/Grades is required'),
  englishLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NATIVE']),
  workExperience: z.string().optional(),
  personalStatement: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type CompletionResponse = {
  completionPercentage: number;
  missingFields: string[];
  blockingReasons: string[];
};

const REQUIRED_FIELD_LABELS: Record<string, string> = {
  dateOfBirth: 'Date of Birth',
  nationality: 'Nationality',
  address: 'Address',
  educationLevel: 'Education Level',
  currentInstitution: 'Current Institution',
  major: 'Major/Field of Study',
  gpa: 'GPA/Grades',
  englishLevel: 'English Proficiency'
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const courseId = searchParams.get('course');
  const courseName = searchParams.get('courseName');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completion, setCompletion] = useState<CompletionResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const watchedValues = watch();

  const localCompletion = useMemo(() => {
    const requiredKeys = Object.keys(REQUIRED_FIELD_LABELS);
    const missing = requiredKeys.filter((k) => {
      const v = (watchedValues as any)[k];
      return v === undefined || v === null || v === '';
    });
    const completedCount = requiredKeys.length - missing.length;
    const pct = Math.round((completedCount / requiredKeys.length) * 100);
    return { pct, missing };
  }, [watchedValues]);

  useEffect(() => {
    const loadCompletion = async () => {
      try {
        setLoadError(null);
        const res = await api.get('/student/completion');
        setCompletion(res.data);
      } catch (_e) {
        setLoadError('Failed to load profile completion.');
      }
    };

    loadCompletion();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Completing profile:', data);
      console.log('Applying to course:', courseId);
      
      // Save profile
      const response = await api.post('/student/profile', data);
      console.log('Profile saved:', response.data);

      // Refresh completion state from server response (preferred) or re-fetch
      const meta = response.data?.meta;
      if (meta?.completionPercentage !== undefined) {
        setCompletion({
          completionPercentage: meta.completionPercentage,
          missingFields: meta.missingFields || [],
          blockingReasons: meta.completionPercentage < 80 ? ['PROFILE_INCOMPLETE'] : []
        });
      } else {
        const completionRes = await api.get('/student/completion');
        setCompletion(completionRes.data);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        if (courseId) {
          // Redirect to application page with course info
          router.push(`/applications/new?course=${courseId}&courseName=${courseName}`);
        } else {
          // Redirect to dashboard
          router.push('/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to complete profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Educational Background';
      case 3: return 'Additional Information';
      default: return '';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <UserIcon className="h-5 w-5" />;
      case 2: return <AcademicCapIcon className="h-5 w-5" />;
      case 3: return <DocumentTextIcon className="h-5 w-5" />;
      default: return null;
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
            <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              {courseName ? `To apply for ${courseName}, please complete your profile` : 'Please complete your profile to continue'}
            </p>
          </div>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-success bg-success/50">
            <CheckCircleIcon className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              Profile completed successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStepIcon()}
                <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
              </div>
              <Badge variant="outline">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>

            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Personal Info</span>
              <span>Education</span>
              <span>Additional</span>
            </div>

            {/* Profile completion status (server + local preview) */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Profile completion</div>
                  <div className="text-xs text-muted-foreground">
                    Complete the required fields to unlock applications.
                  </div>
                </div>
                <Badge variant={(completion?.completionPercentage ?? localCompletion.pct) >= 80 ? 'default' : 'secondary'}>
                  {(completion?.completionPercentage ?? localCompletion.pct)}%
                </Badge>
              </div>

              <div className="mt-3">
                <Progress value={(completion?.completionPercentage ?? localCompletion.pct)} className="h-2" />
              </div>

              {loadError && (
                <p className="mt-2 text-xs text-destructive">{loadError}</p>
              )}

              {(completion?.missingFields?.length ?? localCompletion.missing.length) > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium mb-2">Missing required fields:</div>
                  <div className="flex flex-wrap gap-2">
                    {(completion?.missingFields ?? localCompletion.missing).map((f) => (
                      <Badge key={f} variant="outline" className="text-xs">
                        {REQUIRED_FIELD_LABELS[f] || f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(completion?.blockingReasons || []).includes('PROFILE_INCOMPLETE') && (
                <Alert className="mt-3">
                  <AlertDescription className="text-sm">
                    You need at least <strong>80%</strong> profile completion before submitting an application.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      className="mt-1"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-destructive">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      {...register('nationality')}
                      placeholder="e.g., British, American, etc."
                      className="mt-1"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-destructive">{errors.nationality.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    placeholder="Enter your full address"
                    className="mt-1"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Educational Background */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Educational Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="educationLevel">Education Level *</Label>
                    <Select
                      onValueChange={(value) => setValue('educationLevel', value as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                        <SelectItem value="BACHELOR">Bachelor's Degree</SelectItem>
                        <SelectItem value="MASTER">Master's Degree</SelectItem>
                        <SelectItem value="PHD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.educationLevel && (
                      <p className="mt-1 text-sm text-destructive">{errors.educationLevel.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="currentInstitution">Current Institution *</Label>
                    <Input
                      id="currentInstitution"
                      {...register('currentInstitution')}
                      placeholder="e.g., University of London"
                      className="mt-1"
                    />
                    {errors.currentInstitution && (
                      <p className="mt-1 text-sm text-destructive">{errors.currentInstitution.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input
                      id="major"
                      {...register('major')}
                      placeholder="e.g., Computer Science, Business"
                      className="mt-1"
                    />
                    {errors.major && (
                      <p className="mt-1 text-sm text-destructive">{errors.major.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gpa">GPA/Grades *</Label>
                    <Input
                      id="gpa"
                      {...register('gpa')}
                      placeholder="e.g., 3.8, A grades, First Class"
                      className="mt-1"
                    />
                    {errors.gpa && (
                      <p className="mt-1 text-sm text-destructive">{errors.gpa.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="englishLevel">English Proficiency *</Label>
                    <Select
                      onValueChange={(value) => setValue('englishLevel', value as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your English level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="NATIVE">Native Speaker</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.englishLevel && (
                      <p className="mt-1 text-sm text-destructive">{errors.englishLevel.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="workExperience">Work Experience (Optional)</Label>
                  <Textarea
                    id="workExperience"
                    {...register('workExperience')}
                    placeholder="Describe any relevant work experience"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="personalStatement">Personal Statement (Optional)</Label>
                  <Textarea
                    id="personalStatement"
                    {...register('personalStatement')}
                    placeholder="Tell us about your academic interests and career goals"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Ready to Apply!</h3>
                  <p className="text-sm text-blue-800">
                    {courseName 
                      ? `Your profile will be used to apply for ${courseName}. You can update this information later.`
                      : 'Your profile is now complete. You can browse courses and apply with this information.'
                    }
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}

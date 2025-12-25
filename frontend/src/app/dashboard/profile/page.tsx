'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon, UserIcon, AcademicCapIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(1, 'Address is required'),
  educationLevel: z.enum(['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD']),
  institution: z.string().min(1, 'Current institution is required'),
  major: z.string().min(1, 'Major/Field of study is required'),
  gpa: z.string().min(1, 'GPA is required'),
  englishLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NATIVE']),
  workExperience: z.string().optional(),
  interests: z.string().optional(),
  personalStatement: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const availableCourses = [
    { id: '1', name: 'Computer Science BSc', school: 'University of London', level: 'BACHELOR' },
    { id: '2', name: 'Business Administration MBA', school: 'Manchester Business School', level: 'MASTER' },
    { id: '3', name: 'Data Science MSc', school: 'Imperial College London', level: 'MASTER' },
    { id: '4', name: 'Engineering BEng', school: 'University of Cambridge', level: 'BACHELOR' },
    { id: '5', name: 'Medicine MBBS', school: 'King\'s College London', level: 'BACHELOR' },
  ];

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating profile:', data);
      console.log('Selected courses:', selectedCourses);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Update your information and select courses you're interested in</p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-success bg-success/50">
            <CheckCircleIcon className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              Profile updated successfully! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Enter your first name"
                    className="mt-1"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Enter your last name"
                    className="mt-1"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+44 123 456 7890"
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

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
            </CardContent>
          </Card>

          {/* Educational Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-primary" />
                Educational Background
              </CardTitle>
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
                  <Label htmlFor="institution">Current Institution *</Label>
                  <Input
                    id="institution"
                    {...register('institution')}
                    placeholder="e.g., University of London"
                    className="mt-1"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-sm text-destructive">{errors.institution.message}</p>
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
            </CardContent>
          </Card>

          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-primary" />
                Interested Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select courses you're interested in applying to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedCourses.includes(course.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleCourseSelection(course.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{course.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{course.school}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {course.level}
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedCourses.includes(course.id)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {selectedCourses.includes(course.id) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="interests">Academic Interests (Optional)</Label>
                <Textarea
                  id="interests"
                  {...register('interests')}
                  placeholder="Tell us about your academic interests and career goals"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="personalStatement">Personal Statement (Optional)</Label>
                <Textarea
                  id="personalStatement"
                  {...register('personalStatement')}
                  placeholder="Share your motivation for studying abroad"
                  className="mt-1"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

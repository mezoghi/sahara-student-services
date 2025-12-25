'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const applicationSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED']),
  notes: z.string().optional(),
  adminComments: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assignedTo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface Application {
  id: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  notes?: string;
  adminComments?: string;
  priority: string;
  assignedTo?: string;
  course: {
    name: string;
    school: {
      name: string;
      location: string;
    };
  };
  student: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'DRAFT',
      priority: 'MEDIUM',
      notes: '',
      adminComments: '',
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (params.id) {
      fetchApplication();
    }
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      // Mock data - replace with actual API call
      const mockApplication: Application = {
        id: params.id,
        status: 'UNDER_REVIEW',
        createdAt: '2024-01-10T10:00:00Z',
        submittedAt: '2024-01-12T14:30:00Z',
        notes: 'Student has strong academic background',
        adminComments: 'Pending document verification',
        priority: 'MEDIUM',
        assignedTo: 'admin1',
        course: {
          name: 'Computer Science BSc',
          school: {
            name: 'University of London',
            location: 'London, UK',
          },
        },
        student: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+44 123 456 7890',
        },
      };
      
      setApplication(mockApplication);
      
      // Set form values using reset to ensure proper initialization
      reset({
        status: mockApplication.status as any,
        notes: mockApplication.notes || '',
        adminComments: mockApplication.adminComments || '',
        priority: mockApplication.priority as any,
        assignedTo: mockApplication.assignedTo || '',
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating application:', params.id, data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/admin/applications');
      }, 2000);
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      WAITLISTED: 'bg-purple-100 text-purple-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
          <Card>
            <CardHeader><div className="h-8 w-48 bg-gray-200 rounded animate-pulse" /></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-10 w-full bg-gray-200 rounded animate-pulse" />)}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
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
            Back to Applications
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">Edit Application</h1>
          <p className="text-muted-foreground">Update application status and add comments</p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-success bg-success/50">
            <CheckCircleIcon className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              Application updated successfully! Redirecting to applications list...
            </AlertDescription>
          </Alert>
        )}

        {/* Application Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Application Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Student Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {application.student.firstName} {application.student.lastName}</p>
                  <p><span className="font-medium">Email:</span> {application.student.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.student.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Course Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Course:</span> {application.course.name}</p>
                  <p><span className="font-medium">School:</span> {application.course.school.name}</p>
                  <p><span className="font-medium">Location:</span> {application.course.school.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-3">
                <Badge className={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(application.priority)}>
                  {application.priority} Priority
                </Badge>
                <Badge variant="outline">
                  Submitted: {new Date(application.submittedAt || application.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Application Status *</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="SUBMITTED">Submitted</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="ACCEPTED">Accepted</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.priority && (
                    <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  {...register('assignedTo')}
                  placeholder="Admin user ID or name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Add internal notes about this application"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="adminComments">Admin Comments</Label>
                <Textarea
                  id="adminComments"
                  {...register('adminComments')}
                  placeholder="Comments visible to student"
                  className="mt-1"
                  rows={3}
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
              {isSubmitting ? 'Updating...' : 'Update Application'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

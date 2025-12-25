'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Calendar,
  Bell,
  BookMarked,
  User,
  Upload,
  AlertCircle,
  MapPin,
  Eye
} from 'lucide-react';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  course: {
    name: string;
    school: {
      name: string;
      location: string;
    };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
      DRAFT: 'outline',
      SUBMITTED: 'default',
      UNDER_REVIEW: 'secondary',
      ACCEPTED: 'success',
      REJECTED: 'destructive',
      WAITLISTED: 'warning',
    };
    return variants[status] || 'outline';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      DRAFT: <FileText className="h-4 w-4" />,
      SUBMITTED: <Upload className="h-4 w-4" />,
      UNDER_REVIEW: <Clock className="h-4 w-4" />,
      ACCEPTED: <CheckCircle className="h-4 w-4" />,
      REJECTED: <XCircle className="h-4 w-4" />,
      WAITLISTED: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || <FileText className="h-4 w-4" />;
  };

  const profileCompletion = 75;
  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status !== 'DRAFT').length,
    underReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 leading-tight">
              Welcome back, <span className="text-primary">{user?.firstName}</span>! 👋
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">Track your applications and manage your profile</p>
          </div>
          <Link href="/dashboard/courses">
            <Button size="lg" variant="gradient" className="gap-2 shadow-lg hover:shadow-xl">
              <Plus className="h-5 w-5" />
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-neutral-600">
                  Total Applications
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.total}</div>
                <p className="text-sm text-neutral-500">All time</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-neutral-600">
                  Submitted
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.submitted}</div>
                <p className="text-sm text-neutral-500">In progress</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-neutral-600">
                  Under Review
                </CardTitle>
                <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
                  <Clock className="h-4 w-4 text-warning-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.underReview}</div>
                <p className="text-sm text-neutral-500">Pending</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-neutral-600">
                  Accepted
                </CardTitle>
                <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                  <CheckCircle className="h-4 w-4 text-success-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.accepted}</div>
                <p className="text-sm text-neutral-500">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-neutral-900">My Applications</CardTitle>
                  <CardDescription className="text-neutral-600 mt-1">Track and manage your course applications</CardDescription>
                </div>
                <Link href="/applications">
                  <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-4 rounded-full bg-primary/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">No applications yet</h3>
                  <p className="text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Start your journey by applying to your dream course
                  </p>
                  <Link href="/dashboard/courses">
                    <Button variant="gradient" size="lg" className="shadow-lg hover:shadow-xl">
                      <Plus className="h-5 w-5 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application, index) => (
                    <div key={application.id}>
                      {index > 0 && <Separator className="my-4 bg-neutral-200" />}
                      <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant={getStatusBadge(application.status)} className="gap-1">
                              {getStatusIcon(application.status)}
                              {application.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-neutral-900 mb-2 truncate text-lg leading-tight">
                            {application.course.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <span className="truncate">{application.course.school.name}</span>
                            </div>
                            <span className="hidden sm:inline text-neutral-400">•</span>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>
                                {new Date(application.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/applications/${application.id}`}>
                          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-neutral-900">Profile Completion</CardTitle>
              <CardDescription className="text-neutral-600">Complete your profile to improve your chances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 font-medium">Progress</span>
                  <span className="font-semibold text-neutral-900">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-3 bg-neutral-200" />
              </div>
                <Link href="/dashboard/complete-profile">
                  <Button variant="outline" className="w-full gap-2 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                    <User className="h-4 w-4" />
                    Complete Profile
                  </Button>
                </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-neutral-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/courses">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                  <BookMarked className="h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/applications">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                  <FileText className="h-4 w-4" />
                  My Applications
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-neutral-900">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications
                  .filter(a => a.status === 'DRAFT' || a.status === 'UNDER_REVIEW')
                  .slice(0, 3)
                  .map((app) => (
                    <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{app.course.name}</p>
                        <p className="text-xs text-neutral-600 mt-1">
                          {app.status === 'DRAFT' ? 'Complete application' : 'Awaiting response'}
                        </p>
                      </div>
                    </div>
                  ))}
                {applications.filter(a => a.status === 'DRAFT' || a.status === 'UNDER_REVIEW').length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="border-neutral-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-neutral-900">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-neutral-200 bg-neutral-50">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm text-neutral-700">
                  Our counselors are here to help you with your application process.
                </AlertDescription>
              </Alert>
              <Button variant="accent" className="w-full gap-2 shadow-md hover:shadow-lg">
                <Bell className="h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

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
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      DRAFT: 'outline',
      SUBMITTED: 'default',
      UNDER_REVIEW: 'secondary',
      ACCEPTED: 'default',
      REJECTED: 'destructive',
      WAITLISTED: 'secondary',
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
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-muted-foreground">Track your applications and manage your profile</p>
          </div>
          <Link href="/courses">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Submitted
                </CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.submitted}</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Under Review
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.underReview}</div>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accepted
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.accepted}</div>
                <p className="text-xs text-muted-foreground mt-1">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Track and manage your course applications</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your journey by applying to your dream course
                  </p>
                  <Link href="/courses">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application, index) => (
                    <div key={application.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getStatusBadge(application.status)} className="gap-1">
                              {getStatusIcon(application.status)}
                              {application.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-foreground mb-1 truncate">
                            {application.course.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              <span className="truncate">{application.course.school.name}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(application.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/applications/${application.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completion</CardTitle>
              <CardDescription>Complete your profile to improve your chances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
              <Link href="/profile">
                <Button variant="outline" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/courses">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookMarked className="h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/applications">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  My Applications
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications
                  .filter(a => a.status === 'DRAFT' || a.status === 'UNDER_REVIEW')
                  .slice(0, 3)
                  .map((app) => (
                    <div key={app.id} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{app.course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.status === 'DRAFT' ? 'Complete application' : 'Awaiting response'}
                        </p>
                      </div>
                    </div>
                  ))}
                {applications.filter(a => a.status === 'DRAFT' || a.status === 'UNDER_REVIEW').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming deadlines
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Our counselors are here to help you with your application process.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full gap-2">
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

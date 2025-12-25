'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Calendar,
  Eye,
  BarChart3,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalApplications: number;
  submittedApplications: number;
  underReviewApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalStudents: number;
}

interface RecentApplication {
  id: string;
  status: string;
  submittedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    name: string;
    school: {
      name: string;
    };
  };
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'COUNSELLOR'))) {
      router.push('/dashboard');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
      setRecentApplications(response.data.recentApplications);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {user?.role === 'ADMIN' ? 'Admin' : 'Counsellor'} Dashboard
            </h1>
            <p className="text-muted-foreground">Manage applications and student inquiries</p>
          </div>
          <Link href="/admin/applications">
            <Button size="lg" className="gap-2">
              <Eye className="h-4 w-4" />
              View All Applications
            </Button>
          </Link>
        </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: 'Total Applications',
              value: stats.totalApplications,
              icon: FileText,
              trend: '+12%',
              description: 'All time'
            },
            {
              label: 'Submitted',
              value: stats.submittedApplications,
              icon: CheckCircle,
              trend: '+8%',
              description: 'Awaiting review'
            },
            {
              label: 'Under Review',
              value: stats.underReviewApplications,
              icon: Clock,
              trend: '-3%',
              description: 'In progress'
            },
            {
              label: 'Accepted',
              value: stats.acceptedApplications,
              icon: GraduationCap,
              trend: '+15%',
              description: 'Success rate: 95%'
            },
            {
              label: 'Rejected',
              value: stats.rejectedApplications,
              icon: XCircle,
              trend: '-5%',
              description: 'This month'
            },
            {
              label: 'Total Students',
              value: stats.totalStudents,
              icon: Users,
              trend: '+20%',
              description: 'Active users'
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">{stat.trend}</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/applications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  All Applications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage and review student applications</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/applications?status=SUBMITTED">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Pending Reviews
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Applications waiting for review</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        {user?.role === 'ADMIN' && (
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Manage Users
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>View and manage all users</CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}
        </div>

        {/* Recent Applications */}
        <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest student applications</CardDescription>
        </CardHeader>
        <CardContent>
          {recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">
                Applications will appear here once students start submitting
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{app.course.name}</CardTitle>
                            <CardDescription>{app.course.school.name}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-11">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold">{app.user.firstName} {app.user.lastName}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>{app.user.email}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadge(app.status)}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Review Application
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

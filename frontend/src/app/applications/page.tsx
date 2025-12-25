'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ApplicationListItem = {
  id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | string;
  createdAt?: string;
  submittedAt?: string | null;
  course?: {
    id: string;
    name: string;
    school?: {
      name: string;
    };
    level?: string;
    duration?: string;
  };
  documents?: Array<{
    id: string;
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

export default function ApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await api.get('/applications');
        setApplications(res.data?.applications || []);
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const aDate = new Date(a.createdAt || a.submittedAt || 0).getTime();
      const bDate = new Date(b.createdAt || b.submittedAt || 0).getTime();
      return bDate - aDate;
    });
  }, [applications]);

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
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Applications</h1>
            <p className="text-muted-foreground">Track your applications and manage drafts.</p>
          </div>
          <Button onClick={() => router.push('/courses')}>Browse Courses</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-sm text-muted-foreground">Loading applications…</div>
            </CardContent>
          </Card>
        ) : sortedApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="space-y-2">
                <div className="text-base font-semibold">No applications yet</div>
                <div className="text-sm text-muted-foreground">
                  Start by browsing courses and creating an application draft.
                </div>
                <div className="pt-2">
                  <Button onClick={() => router.push('/courses')}>Browse Courses</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedApplications.map((app) => {
              const courseName = app.course?.name || 'Course';
              const schoolName = app.course?.school?.name;
              const docsCount = app.documents?.length || 0;

              return (
                <Card key={app.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="truncate">{courseName}</CardTitle>
                        <div className="text-sm text-muted-foreground truncate">
                          {schoolName ? schoolName : '—'}
                        </div>
                      </div>
                      <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div>Documents: {docsCount}</div>
                      {app.course?.level && <div>Level: {app.course.level}</div>}
                      {app.course?.duration && <div>Duration: {app.course.duration}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                      <Link href={`/applications/${app.id}`}>
                        <Button variant="outline">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

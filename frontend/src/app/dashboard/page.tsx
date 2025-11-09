'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  course: {
    name: string;
    school: {
      name: string;
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">{t.common.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      WAITLISTED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                    <AcademicCapIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary">
                      {t.dashboard.welcome}, {user?.firstName}! 👋
                    </h1>
                  </div>
                </div>
                <p className="text-gray-600 ml-15">{t.dashboard.subtitle}</p>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Link
                  href="/courses"
                  className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-600 text-white rounded-xl font-semibold shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>{t.dashboard.newApplication}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              {
                label: t.dashboard.stats.totalApplications,
                value: applications.length,
                icon: DocumentTextIcon,
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600'
              },
              {
                label: t.dashboard.stats.submitted,
                value: applications.filter(a => a.status !== 'DRAFT').length,
                icon: CheckCircleIcon,
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
              },
              {
                label: t.dashboard.stats.underReview,
                value: applications.filter(a => a.status === 'UNDER_REVIEW').length,
                icon: ClockIcon,
                color: 'from-yellow-500 to-yellow-600',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-600'
              },
              {
                label: t.dashboard.stats.accepted,
                value: applications.filter(a => a.status === 'ACCEPTED').length,
                icon: AcademicCapIcon,
                color: 'from-accent to-accent-600',
                bgColor: 'bg-red-50',
                textColor: 'text-accent'
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-400 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <ChartBarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-3xl shadow-soft-lg p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-1">{t.dashboard.myApplications.title}</h2>
                <p className="text-gray-600 text-sm">{t.dashboard.myApplications.subtitle}</p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.dashboard.myApplications.noApplications}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t.dashboard.myApplications.noApplicationsDesc}
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold shadow-soft-lg hover:shadow-soft-xl transform hover:-translate-y-0.5 transition-all duration-400"
                >
                  <AcademicCapIcon className="h-5 w-5" />
                  <span>{t.dashboard.myApplications.browseCourses}</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, index) => (
                  <div
                    key={app.id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-soft-lg transition-all duration-400"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                            <AcademicCapIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                              {app.course.name}
                            </h3>
                            <p className="text-gray-600 text-sm font-medium">{app.course.school.name}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(app.status)} shadow-inner-soft`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{t.dashboard.myApplications.created} {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                        {app.submittedAt && (
                          <div className="flex items-center space-x-1">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span>{t.dashboard.myApplications.submitted} {new Date(app.submittedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/applications/${app.id}`}
                        className="group/link inline-flex items-center space-x-2 text-accent font-semibold hover:text-accent-600 transition-colors"
                      >
                        <span>{t.dashboard.myApplications.viewDetails}</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
    </DashboardLayout>
  );
}

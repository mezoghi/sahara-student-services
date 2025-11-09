'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

interface Application {
  id: string;
  status: string;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  previousEducation: string | null;
  gpa: number | null;
  englishProficiency: string | null;
  personalStatement: string | null;
  referenceContact: string | null;
  submittedAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  course: {
    name: string;
    level: string;
    school: {
      name: string;
      country: string;
    };
  };
  documents: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
}

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'COUNSELLOR'))) {
      router.push('/dashboard');
    } else if (user) {
      fetchApplication();
    }
  }, [user, authLoading, router, params.id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/admin/applications/${params.id}`);
      setApplication(response.data.application);
      setNewStatus(response.data.application.status);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      router.push('/admin/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === application?.status) {
      alert('Please select a different status');
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/admin/applications/${params.id}/status`, {
        status: newStatus,
        notes,
      });
      alert('Application status updated successfully!');
      fetchApplication();
      setNotes('');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const downloadDocument = async (docId: string, fileName: string) => {
    try {
      const response = await api.get(`/applications/${params.id}/documents/${docId}/download`);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!application) {
    return null;
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/admin/applications" className="text-accent font-semibold hover:underline mb-4 inline-block">
                ← Back to Applications
              </Link>
              <h1 className="text-4xl font-bold text-primary mb-2">Application Review</h1>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </span>
                {application.submittedAt && (
                  <span className="text-gray-600">
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Student Information */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-primary mb-4">Student Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{application.user.firstName} {application.user.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{application.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{application.user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nationality</p>
                      <p className="font-semibold">{application.nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-semibold">
                        {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passport Number</p>
                      <p className="font-semibold">{application.passportNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold">
                      {application.address || 'N/A'}
                      {application.city && `, ${application.city}`}
                      {application.country && `, ${application.country}`}
                      {application.postalCode && ` ${application.postalCode}`}
                    </p>
                  </div>
                </div>

                {/* Course Information */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-primary mb-4">Course Details</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Course</p>
                      <p className="font-semibold text-lg">{application.course.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Level</p>
                      <p className="font-semibold">{application.course.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">University</p>
                      <p className="font-semibold">{application.course.school.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{application.course.school.country}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Background */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-primary mb-4">Academic Background</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Previous Education</p>
                      <p className="text-gray-800 whitespace-pre-line">
                        {application.previousEducation || 'Not provided'}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">GPA / Grade</p>
                        <p className="font-semibold">{application.gpa || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">English Proficiency</p>
                        <p className="font-semibold">{application.englishProficiency || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference Contact</p>
                      <p className="font-semibold">{application.referenceContact || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Statement */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-primary mb-4">Personal Statement</h2>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {application.personalStatement || 'Not provided'}
                  </p>
                </div>

                {/* Documents */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-primary mb-4">Uploaded Documents</h2>
                  {application.documents.length === 0 ? (
                    <p className="text-gray-600">No documents uploaded</p>
                  ) : (
                    <div className="space-y-3">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div>
                            <p className="font-semibold">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => downloadDocument(doc.id, doc.fileName)}
                            className="btn-secondary"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - Status Update */}
              <div className="md:col-span-1">
                <div className="card sticky top-4">
                  <h2 className="text-2xl font-bold text-primary mb-4">Update Status</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="input-field"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WAITLISTED">Waitlisted</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input-field"
                        rows={4}
                        placeholder="Add notes about this status update..."
                      />
                    </div>

                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating || newStatus === application.status}
                      className="btn-primary w-full"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Quick Actions</p>
                      <div className="space-y-2">
                        <button className="btn-secondary w-full text-sm">
                          Send Message to Student
                        </button>
                        <button className="btn-secondary w-full text-sm">
                          Request Additional Documents
                        </button>
                        <button className="btn-secondary w-full text-sm">
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

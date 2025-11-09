'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/context/AuthContext';
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
  course: {
    name: string;
    school: {
      name: string;
    };
  };
  documents: Array<{
    id: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
  }>;
}

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchApplication();
    }
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${params.id}`);
      setApplication(response.data.application);
      setFormData(response.data.application);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.put(`/applications/${params.id}`, formData);
      alert('Draft saved successfully!');
      fetchApplication();
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.dateOfBirth || !formData.nationality || !formData.personalStatement) {
      alert('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/applications/${params.id}/submit`);
      alert('Application submitted successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      alert(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await api.post(`/applications/${params.id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', response.data);
      alert('Document uploaded successfully!');
      fetchApplication();
    } catch (error: any) {
      console.error('Failed to upload document:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to upload document: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const isEditable = application.status === 'DRAFT';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Application Form</h1>
              <p className="text-gray-600">{application.course.name} at {application.course.school.name}</p>
              <div className="mt-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  application.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                  application.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            {isEditable && (
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {['Personal Info', 'Academic Background', 'Documents', 'Review'].map((step, index) => (
                    <div key={index} className="flex-1">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          currentStep > index + 1 ? 'bg-green-500 text-white' :
                          currentStep === index + 1 ? 'bg-primary text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        {index < 3 && (
                          <div className={`flex-1 h-1 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      <p className="text-sm mt-2 text-center">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <div className="card">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Personal Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber || ''}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {isEditable && (
                    <div className="flex justify-between pt-6">
                      <button onClick={handleSaveDraft} disabled={saving} className="btn-secondary">
                        {saving ? 'Saving...' : 'Save Draft'}
                      </button>
                      <button onClick={() => setCurrentStep(2)} className="btn-primary">
                        Next Step →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Academic Background */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Academic Background</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Education *</label>
                    <textarea
                      name="previousEducation"
                      value={formData.previousEducation || ''}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="input-field"
                      rows={4}
                      placeholder="Describe your educational background..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA / Grade</label>
                      <input
                        type="number"
                        step="0.01"
                        name="gpa"
                        value={formData.gpa || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">English Proficiency *</label>
                      <select
                        name="englishProficiency"
                        value={formData.englishProficiency || ''}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="input-field"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="Cambridge">Cambridge</option>
                        <option value="Native Speaker">Native Speaker</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personal Statement *</label>
                    <textarea
                      name="personalStatement"
                      value={formData.personalStatement || ''}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="input-field"
                      rows={8}
                      placeholder="Why do you want to study this course? What are your career goals?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference Contact</label>
                    <input
                      type="text"
                      name="referenceContact"
                      value={formData.referenceContact || ''}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="input-field"
                      placeholder="Email or phone of your reference"
                    />
                  </div>

                  {isEditable && (
                    <div className="flex justify-between pt-6">
                      <button onClick={() => setCurrentStep(1)} className="btn-secondary">
                        ← Previous
                      </button>
                      <div className="flex gap-4">
                        <button onClick={handleSaveDraft} disabled={saving} className="btn-secondary">
                          {saving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button onClick={() => setCurrentStep(3)} className="btn-primary">
                          Next Step →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Upload Documents</h2>
                  
                  {isEditable && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-gray-600 mb-2">
                          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </div>
                        <div className="text-sm text-gray-500">
                          PDF, JPG, PNG, DOC, DOCX (max 10MB)
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Uploaded Documents</h3>
                    {application.documents.length === 0 ? (
                      <p className="text-gray-500">No documents uploaded yet</p>
                    ) : (
                      application.documents.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {isEditable && (
                    <div className="flex justify-between pt-6">
                      <button onClick={() => setCurrentStep(2)} className="btn-secondary">
                        ← Previous
                      </button>
                      <button onClick={() => setCurrentStep(4)} className="btn-primary">
                        Review & Submit →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Review Your Application</h2>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">
                      Please review all information carefully before submitting. Once submitted, you cannot edit your application.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><strong>Date of Birth:</strong> {formData.dateOfBirth || 'Not provided'}</p>
                        <p><strong>Nationality:</strong> {formData.nationality || 'Not provided'}</p>
                        <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Academic Background</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><strong>English Proficiency:</strong> {formData.englishProficiency || 'Not provided'}</p>
                        <p><strong>Documents:</strong> {application.documents.length} uploaded</p>
                      </div>
                    </div>
                  </div>

                  {isEditable && (
                    <div className="flex justify-between pt-6">
                      <button onClick={() => setCurrentStep(3)} className="btn-secondary">
                        ← Previous
                      </button>
                      <button onClick={handleSubmit} disabled={submitting} className="btn-accent">
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

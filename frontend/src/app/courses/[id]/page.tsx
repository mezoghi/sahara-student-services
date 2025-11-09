'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';

interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  description: string;
  requirements: string;
  startDate: string;
  school: {
    id: string;
    name: string;
    country: string;
    city: string;
    description: string;
    website: string;
    ranking: number;
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${params.id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await api.post('/applications', {
        courseId: params.id,
      });
      router.push(`/applications/${response.data.application.id}`);
    } catch (error) {
      console.error('Failed to create application:', error);
      alert('Failed to start application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Course Header */}
            <div className="card mb-8">
              <div className="mb-4">
                <span className="inline-block bg-accent text-white text-sm px-4 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-primary mb-4">{course.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span className="font-semibold text-xl">{course.school.name}</span>
                <span>•</span>
                <span>{course.school.city}, {course.school.country}</span>
                {course.school.ranking && (
                  <>
                    <span>•</span>
                    <span>Ranked #{course.school.ranking}</span>
                  </>
                )}
              </div>
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-semibold text-lg">{course.duration}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Tuition Fee</p>
                  <p className="font-semibold text-lg text-accent">
                    {course.currency} {course.tuitionFee.toLocaleString()}/year
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Start Date</p>
                  <p className="font-semibold text-lg">{course.startDate}</p>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary text-lg px-8 py-3"
              >
                {applying ? 'Processing...' : 'Apply Now'}
              </button>
            </div>

            {/* Course Description */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Course Description</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Entry Requirements */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Entry Requirements</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.requirements}</p>
            </div>

            {/* About the School */}
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-4">About {course.school.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{course.school.description}</p>
              {course.school.website && (
                <a
                  href={course.school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold hover:underline"
                >
                  Visit University Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

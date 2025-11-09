'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  school: {
    name: string;
    country: string;
    city: string;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      const params = filter !== 'all' ? { level: filter } : {};
      const response = await api.get('/courses', { params });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-8">Browse Courses</h1>

          {/* Filters */}
          <div className="mb-8 flex gap-4 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter('Undergraduate')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'Undergraduate' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Undergraduate
            </button>
            <button
              onClick={() => setFilter('Postgraduate')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'Postgraduate' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Postgraduate
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="card">
                  <div className="mb-4">
                    <span className="inline-block bg-accent text-white text-xs px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{course.name}</h3>
                  <p className="text-gray-600 mb-2">{course.school.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.school.city}, {course.school.country}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Duration: {course.duration}</span>
                    <span className="text-lg font-bold text-accent">
                      {course.currency} {course.tuitionFee.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/courses/${course.id}`} className="btn-primary w-full text-center block">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No courses found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

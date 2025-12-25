'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MagnifyingGlassIcon, AcademicCapIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

interface Course {
  id: string;
  name: string;
  description: string;
  school: {
    name: string;
    location: string;
    logo?: string;
  };
  level: 'BACHELOR' | 'MASTER' | 'PHD' | 'DIPLOMA';
  duration: string;
  price: string;
  rating: number;
  requirements: string[];
  deadline: string;
  category: string;
}

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedLevel, selectedCategory]);

  const fetchCourses = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCourses: Course[] = [
        {
          id: '1',
          name: 'Computer Science BSc',
          description: 'Learn programming, algorithms, and software development with cutting-edge technologies.',
          school: {
            name: 'University of London',
            location: 'London, UK',
          },
          level: 'BACHELOR',
          duration: '3 years',
          price: '£18,000/year',
          rating: 4.8,
          requirements: ['Math A-level', 'English proficiency', 'Personal statement'],
          deadline: '2024-01-15',
          category: 'Technology'
        },
        {
          id: '2',
          name: 'Business Administration MBA',
          description: 'Develop leadership skills and business acumen for executive roles.',
          school: {
            name: 'Manchester Business School',
            location: 'Manchester, UK',
          },
          level: 'MASTER',
          duration: '2 years',
          price: '£25,000/year',
          rating: 4.9,
          requirements: ['Bachelor degree', '3 years experience', 'GMAT/GRE'],
          deadline: '2024-02-01',
          category: 'Business'
        },
        {
          id: '3',
          name: 'Data Science MSc',
          description: 'Master data analysis, machine learning, and statistical modeling.',
          school: {
            name: 'Imperial College London',
            location: 'London, UK',
          },
          level: 'MASTER',
          duration: '1 year',
          price: '£28,000/year',
          rating: 4.7,
          requirements: ['STEM background', 'Programming skills', 'Mathematics'],
          deadline: '2024-01-20',
          category: 'Technology'
        },
        {
          id: '4',
          name: 'Engineering BEng',
          description: 'Comprehensive engineering program with multiple specializations.',
          school: {
            name: 'University of Cambridge',
            location: 'Cambridge, UK',
          },
          level: 'BACHELOR',
          duration: '4 years',
          price: '£22,000/year',
          rating: 4.9,
          requirements: ['Physics & Math A-level', 'Engineering aptitude'],
          deadline: '2024-01-10',
          category: 'Engineering'
        },
        {
          id: '5',
          name: 'Medicine MBBS',
          description: 'Complete medical training program with clinical practice.',
          school: {
            name: 'King\'s College London',
            location: 'London, UK',
          },
          level: 'BACHELOR',
          duration: '5 years',
          price: '£35,000/year',
          rating: 4.8,
          requirements: ['Biology & Chemistry', 'Medical experience', 'Interview'],
          deadline: '2024-01-05',
          category: 'Medicine'
        },
        {
          id: '6',
          name: 'International Relations MA',
          description: 'Study global politics, diplomacy, and international law.',
          school: {
            name: 'London School of Economics',
            location: 'London, UK',
          },
          level: 'MASTER',
          duration: '1 year',
          price: '£20,000/year',
          rating: 4.6,
          requirements: ['Social science background', 'Research skills'],
          deadline: '2024-01-25',
          category: 'Social Sciences'
        }
      ];
      
      setCourses(mockCourses);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.school.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const applyToCourses = () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course to apply to');
      return;
    }
    
    // Navigate to application page with selected courses
    router.push(`/applications/new?courses=${selectedCourses.join(',')}`);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      BACHELOR: 'bg-blue-100 text-blue-800',
      MASTER: 'bg-purple-100 text-purple-800',
      PHD: 'bg-red-100 text-red-800',
      DIPLOMA: 'bg-green-100 text-green-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Available Courses</h1>
          <p className="text-muted-foreground">Browse and select courses you're interested in applying to</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="BACHELOR">Bachelor's</SelectItem>
                  <SelectItem value="MASTER">Master's</SelectItem>
                  <SelectItem value="PHD">PhD</SelectItem>
                  <SelectItem value="DIPLOMA">Diploma</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Courses Summary */}
        {selectedCourses.length > 0 && (
          <Card className="mb-6 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">
                    {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready to apply to your selected courses
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedCourses([])}>
                    Clear Selection
                  </Button>
                  <Button onClick={() => {
                    if (selectedCourses.length > 0) {
                      router.push('/dashboard/complete-profile');
                    }
                  }}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedCourses.includes(course.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleCourseSelection(course.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <AcademicCapIcon className="h-4 w-4" />
                      <span>{course.school.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{course.school.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-primary" />
                    <span>{course.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Key Requirements:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.requirements.slice(0, 2).map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {course.requirements.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.requirements.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Deadline: {new Date(course.deadline).toLocaleDateString()}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedCourses.includes(course.id)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {selectedCourses.includes(course.id) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <AcademicCapIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more courses
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedLevel('all');
                setSelectedCategory('all');
              }}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

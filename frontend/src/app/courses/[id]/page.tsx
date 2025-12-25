'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  Award, 
  Globe, 
  CheckCircle2,
  ArrowLeft,
  Share2,
  Heart,
  Info
} from 'lucide-react';

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
  const [saved, setSaved] = useState(false);

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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full p-8">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/courses">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Courses
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={course.level === 'Undergraduate' ? 'default' : 'secondary'} className="text-sm">
                      {course.level}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSaved(!saved)}
                      >
                        <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-3">{course.name}</CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-semibold">{course.school.name}</span>
                  </CardDescription>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{course.school.city}, {course.school.country}</span>
                    {course.school.ranking && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <Award className="h-4 w-4" />
                        <span>Ranked #{course.school.ranking}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 py-4">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold">{course.duration}</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Tuition Fee</p>
                      <p className="font-semibold">
                        {course.currency} {course.tuitionFee.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                      <p className="font-semibold">{course.startDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Details Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="university">University</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Course Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Entry Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Meeting the minimum requirements doesn't guarantee admission. Each application is reviewed individually.
                        </AlertDescription>
                      </Alert>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {course.requirements}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="university" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        About {course.school.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {course.school.description}
                      </p>
                      {course.school.website && (
                        <div>
                          <Separator className="my-4" />
                          <a
                            href={course.school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary font-semibold hover:underline"
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Visit University Website
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Ready to Apply?</CardTitle>
                  <CardDescription>
                    Start your application process today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Application Fee</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Time</span>
                      <span className="font-semibold">2-4 weeks</span>
                    </div>
                  </div>
                  <Separator />
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? 'Processing...' : 'Apply Now'}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-center text-muted-foreground">
                      You'll need to sign in to apply
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Level</p>
                      <p className="text-sm text-muted-foreground">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {course.school.city}, {course.school.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{course.startDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

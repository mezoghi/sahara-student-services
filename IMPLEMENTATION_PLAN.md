# Implementation Plan: Progressive Student Registration System

## Backend Implementation

### 1. Database Schema Implementation

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE student_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  nationality VARCHAR(100),
  address TEXT,
  education_level VARCHAR(50),
  current_institution VARCHAR(200),
  major VARCHAR(100),
  gpa VARCHAR(10),
  english_level VARCHAR(20),
  work_experience TEXT,
  personal_statement TEXT,
  profile_completion_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  institution VARCHAR(200) NOT NULL,
  level VARCHAR(50),
  duration VARCHAR(100),
  price VARCHAR(50),
  requirements TEXT[],
  deadline DATE,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  personal_statement TEXT,
  additional_info TEXT,
  submitted_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create application_documents table
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_course_id ON applications(course_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_category ON courses(category);
```

### 2. API Endpoints Implementation

#### Authentication Endpoints

```typescript
// /api/auth/register
export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json();
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if user exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 409 });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.query(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, role',
      [firstName, lastName, email, phone, passwordHash]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!);
    
    return Response.json({ 
      user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}

// /api/auth/login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const result = await db.query('SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!);
    
    return Response.json({ 
      user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
```

#### Student Profile Endpoints

```typescript
// /api/student/profile
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await db.query('SELECT * FROM student_profiles WHERE user_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return Response.json({ profile: null });
    }
    
    return Response.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profileData = await request.json();
    
    // Calculate completion percentage
    const requiredFields = ['date_of_birth', 'nationality', 'address', 'education_level', 'current_institution', 'major', 'gpa', 'english_level'];
    const completedFields = requiredFields.filter(field => profileData[field]).length;
    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
    
    // Upsert profile
    const result = await db.query(`
      INSERT INTO student_profiles (user_id, date_of_birth, nationality, address, education_level, current_institution, major, gpa, english_level, work_experience, personal_statement, profile_completion_percentage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        date_of_birth = EXCLUDED.date_of_birth,
        nationality = EXCLUDED.nationality,
        address = EXCLUDED.address,
        education_level = EXCLUDED.education_level,
        current_institution = EXCLUDED.current_institution,
        major = EXCLUDED.major,
        gpa = EXCLUDED.gpa,
        english_level = EXCLUDED.english_level,
        work_experience = EXCLUDED.work_experience,
        personal_statement = EXCLUDED.personal_statement,
        profile_completion_percentage = EXCLUDED.profile_completion_percentage,
        updated_at = NOW()
      RETURNING *
    `, [
      userId, 
      profileData.dateOfBirth, 
      profileData.nationality, 
      profileData.address, 
      profileData.educationLevel, 
      profileData.currentInstitution, 
      profileData.major, 
      profileData.gpa, 
      profileData.englishLevel, 
      profileData.workExperience, 
      profileData.personalStatement,
      completionPercentage
    ]);
    
    return Response.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Save profile error:', error);
    return Response.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
```

#### Application Endpoints

```typescript
// /api/applications
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { courseId, personalStatement, additionalInfo, uploadedFiles } = await request.json();
    
    // Create application
    const result = await db.query(`
      INSERT INTO applications (student_id, course_id, personal_statement, additional_info, status)
      VALUES ($1, $2, $3, $4, 'SUBMITTED')
      RETURNING *
    `, [userId, courseId, personalStatement, additionalInfo]);
    
    const application = result.rows[0];
    
    // Handle file uploads (if any)
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        await db.query(`
          INSERT INTO application_documents (application_id, filename, file_path, file_size, mime_type)
          VALUES ($1, $2, $3, $4, $5)
        `, [application.id, file.name, file.path, file.size, file.type]);
      }
    }
    
    return Response.json({ application });
  } catch (error) {
    console.error('Submit application error:', error);
    return Response.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await db.query(`
      SELECT a.*, c.name as course_name, c.institution, c.level
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.created_at DESC
    `, [userId]);
    
    return Response.json({ applications: result.rows });
  } catch (error) {
    console.error('Get applications error:', error);
    return Response.json({ error: 'Failed to get applications' }, { status: 500 });
  }
}
```

### 3. Frontend Implementation

#### Enhanced Registration Page

```typescript
// /app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input {...register('firstName')} placeholder="First Name" />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div>
                <Input {...register('lastName')} placeholder="Last Name" />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <Input {...register('email')} type="email" placeholder="Email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            
            <Input {...register('phone')} placeholder="Phone Number" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            
            <Input {...register('password')} type="password" placeholder="Password" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            
            <Input {...register('confirmPassword')} type="password" placeholder="Confirm Password" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Quick Registration:</strong> Start browsing courses immediately. Complete your profile when you're ready to apply.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Enhanced Profile Completion Page

```typescript
// /app/dashboard/complete-profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const profileSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(1, 'Address is required'),
  educationLevel: z.enum(['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD']),
  currentInstitution: z.string().min(1, 'Current institution is required'),
  major: z.string().min(1, 'Major is required'),
  gpa: z.string().min(1, 'GPA is required'),
  englishLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NATIVE']),
  workExperience: z.string().optional(),
  personalStatement: z.string().optional(),
});

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Check if profile already exists
    const checkProfile = async () => {
      try {
        const response = await api.get('/api/student/profile');
        if (response.data.profile) {
          setExistingProfile(response.data.profile);
          // Pre-fill form with existing data
          Object.keys(response.data.profile).forEach(key => {
            if (response.data.profile[key]) {
              setValue(key, response.data.profile[key]);
            }
          });
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    
    checkProfile();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const response = await api.post('/api/student/profile', data);
      console.log('Profile saved:', response.data);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        if (courseId) {
          router.push(`/applications/new?course=${courseId}`);
        } else {
          router.push('/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <p className="text-gray-600">
            {courseId ? 'To apply for this course, please complete your profile' : 'Complete your profile to improve your application chances'}
          </p>
        </CardHeader>
        
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4">
              <AlertDescription>Profile completed successfully!</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Input {...register('dateOfBirth')} type="date" placeholder="Date of Birth" />
                <Input {...register('nationality')} placeholder="Nationality" />
                <textarea {...register('address')} placeholder="Address" className="w-full p-2 border rounded" rows={3} />
                
                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>Next</Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Educational Background */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Educational Background</h3>
                <select {...register('educationLevel')} className="w-full p-2 border rounded">
                  <option value="">Select Education Level</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="BACHELOR">Bachelor's Degree</option>
                  <option value="MASTER">Master's Degree</option>
                  <option value="PHD">PhD</option>
                </select>
                <Input {...register('currentInstitution')} placeholder="Current Institution" />
                <Input {...register('major')} placeholder="Major/Field of Study" />
                <Input {...register('gpa')} placeholder="GPA/Grades" />
                <select {...register('englishLevel')} className="w-full p-2 border rounded">
                  <option value="">Select English Level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="NATIVE">Native</option>
                </select>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
                  <Button type="button" onClick={nextStep}>Next</Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <textarea {...register('workExperience')} placeholder="Work Experience (Optional)" className="w-full p-2 border rounded" rows={3} />
                <textarea {...register('personalStatement')} placeholder="Personal Statement (Optional)" className="w-full p-2 border rounded" rows={4} />
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your profile is now complete! You can submit your application.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Complete Profile'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 4. Testing Strategy

### Unit Tests
- API endpoint testing
- Form validation testing
- Component rendering testing

### Integration Tests
- End-to-end user flow testing
- Database transaction testing
- File upload testing

### User Acceptance Testing
- Registration flow testing
- Profile completion testing
- Application submission testing

## 5. Deployment Strategy

### Phase 1: Basic Implementation
- Database schema setup
- Basic registration and login
- Course browsing functionality

### Phase 2: Profile Completion
- Multi-step profile form
- Progress tracking
- Data validation

### Phase 3: Application System
- Application submission
- Document upload
- Status tracking

### Phase 4: Optimization
- Performance optimization
- Mobile responsiveness
- Accessibility improvements

## 6. Monitoring & Analytics

### Key Metrics to Track
- Registration completion rate
- Profile completion rate
- Application submission rate
- Drop-off points in the funnel

### Tools
- Google Analytics for user behavior
- Custom analytics for conversion tracking
- Error monitoring for system stability

This implementation plan provides a comprehensive roadmap for building the progressive student registration system with a focus on user experience, scalability, and conversion optimization.

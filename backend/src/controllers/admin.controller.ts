import { Response } from 'express';
import { ApplicationStatus, Prisma, UserRole } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEmail } from '../utils/email.util';
import { getSignedUrl } from '../utils/s3.util';
import prisma from '../lib/prisma';

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      ...(status && { status: status as ApplicationStatus }),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          course: {
            include: {
              school: true,
            },
          },
          documents: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.application.count({ where }),
    ]);

    res.json({
      applications,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const getApplicationDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
          },
        },
        course: {
          include: {
            school: true,
          },
        },
        documents: true,
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Generate signed URLs for documents
    const documentsWithUrls = await Promise.all(
      application.documents.map(async (doc) => ({
        ...doc,
        downloadUrl: await getSignedUrl(doc.s3Key),
      }))
    );

    res.json({
      application: {
        ...application,
        documents: documentsWithUrls,
      },
    });
  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ error: 'Failed to fetch application details' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        course: {
          include: {
            school: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id,
      },
      include: {
        course: {
          include: {
            school: true,
          },
        },
      },
    });

    // Send status update email
    const statusMessages: Record<ApplicationStatus, string> = {
      [ApplicationStatus.DRAFT]: 'Your application is in draft status.',
      [ApplicationStatus.SUBMITTED]: 'Your application has been submitted.',
      [ApplicationStatus.UNDER_REVIEW]: 'Your application is currently under review.',
      [ApplicationStatus.ACCEPTED]: 'Congratulations! Your application has been accepted.',
      [ApplicationStatus.REJECTED]: 'Unfortunately, your application has been rejected.',
      [ApplicationStatus.WAITLISTED]: 'Your application has been placed on the waitlist.',
    };

    await sendEmail({
      to: application.user.email,
      subject: `Application Status Update: ${status}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${application.user.firstName},</p>
        <p>${statusMessages[status as ApplicationStatus]}</p>
        <p><strong>Course:</strong> ${application.course.name}</p>
        <p><strong>School:</strong> ${application.course.school.name}</p>
        ${adminNotes ? `<p><strong>Notes:</strong> ${adminNotes}</p>` : ''}
        <p>Best regards,<br>Sahara Student Services</p>
      `,
    });

    res.json({
      message: 'Application status updated successfully',
      application: updated,
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalApplications,
      submittedApplications,
      underReviewApplications,
      acceptedApplications,
      rejectedApplications,
      totalStudents,
      recentApplications,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: ApplicationStatus.SUBMITTED } }),
      prisma.application.count({ where: { status: ApplicationStatus.UNDER_REVIEW } }),
      prisma.application.count({ where: { status: ApplicationStatus.ACCEPTED } }),
      prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.application.findMany({
        take: 10,
        orderBy: { submittedAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          course: {
            include: {
              school: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalApplications,
        submittedApplications,
        underReviewApplications,
        acceptedApplications,
        rejectedApplications,
        totalStudents,
      },
      recentApplications,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search, status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Prisma.UserWhereInput = {
      ...(role && { role: role as UserRole }),
      ...(status && { isActive: status === 'active' }),
      ...(search && {
        OR: [
          { email: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
          { firstName: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
          { phone: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Add application count to each user
    const usersWithCounts = users.map(user => ({
      ...user,
      applications: user._count?.applications || 0,
      status: user.isActive ? 'active' : 'inactive'
    }));

    res.json({
      users: usersWithCounts,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            course: {
              include: {
                school: true,
              },
            },
            documents: true,
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20', search, universityId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    
    if (status && status !== 'ALL') {
      where.isActive = status === 'ACTIVE';
    }
    
    if (universityId && universityId !== 'ALL') {
      where.schoolId = universityId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const sortField = typeof sortBy === 'string' ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.CourseOrderByWithRelationInput =
      sortField === 'university.name' || sortField === 'school.name'
        ? { school: { name: sortDirection } }
        : ({ [sortField]: sortDirection } as Prisma.CourseOrderByWithRelationInput);

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          school: {
            select: {
              id: true,
              name: true,
              logo: true,
              website: true,
            },
          },
        },
        orderBy,
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      courses,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      name,
      schoolId,
      level,
      duration,
      tuitionFee,
      currency = 'GBP',
      description,
      requirements,
      startDate,
    } = req.body;

    // Verify school exists
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const course = await prisma.course.create({
      data: {
        name,
        schoolId,
        level,
        duration,
        tuitionFee,
        currency,
        description,
        requirements,
        startDate,
        isActive: true,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const {
      name,
      schoolId,
      level,
      duration,
      tuitionFee,
      currency,
      description,
      requirements,
      startDate,
      isActive,
    } = req.body;

    // Verify course exists
    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If schoolId is being updated, verify the new school exists
    if (schoolId && schoolId !== existingCourse.schoolId) {
      const school = await prisma.school.findUnique({ where: { id: schoolId } });
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(schoolId && { schoolId }),
        ...(level && { level }),
        ...(duration && { duration }),
        ...(tuitionFee !== undefined && { tuitionFee }),
        ...(currency && { currency }),
        ...(description && { description }),
        ...(requirements && { requirements }),
        ...(startDate && { startDate }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    res.json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    // Check if course has any applications
    const applicationCount = await prisma.application.count({ where: { courseId: id } });
    if (applicationCount > 0) {
      return res.status(400).json({ error: 'Cannot delete course with existing applications' });
    }

    await prisma.course.delete({ where: { id } });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

export const bulkUpdateCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { courseIds, status } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'Course IDs are required' });
    }

    if (!status || !['ACTIVE', 'INACTIVE', 'DRAFT'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const result = await prisma.course.updateMany({
      where: {
        id: { in: courseIds },
      },
      data: {
        isActive: status === 'ACTIVE',
      },
    });

    res.json({
      message: 'Courses updated successfully',
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Bulk update courses error:', error);
    res.status(500).json({ error: 'Failed to update courses' });
  }
};

export const getAllUniversities = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '100' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [universities, total] = await Promise.all([
      prisma.school.findMany({
        where: { isActive: true },
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
          description: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({ where: { isActive: true } }),
    ]);

    res.json({
      universities,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get all universities error:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, isActive, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
        ...(role && { role }),
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting own account
    if (user.id === req.user?.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user and related data in a transaction
    await prisma.$transaction([
      // Delete related data first
      prisma.application.deleteMany({ where: { userId: id } }),
      prisma.document.deleteMany({ where: { application: { userId: id } } }),
      // Then delete the user
      prisma.user.delete({ where: { id } }),
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

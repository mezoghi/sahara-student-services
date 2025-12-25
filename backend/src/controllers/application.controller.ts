import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEmail } from '../utils/email.util';
import { getSignedUrl } from '../utils/s3.util';

const prisma = new PrismaClient();

export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            school: true,
          },
        },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { courseId } = req.body;

    // Verify course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        courseId,
        status: ApplicationStatus.DRAFT,
      },
      include: {
        course: {
          include: {
            school: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        course: {
          include: {
            school: true,
          },
        },
        documents: true,
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
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Verify ownership
    const existing = await prisma.application.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Don't allow updating submitted applications
    if (existing.status !== ApplicationStatus.DRAFT) {
      return res.status(400).json({ error: 'Cannot update submitted application' });
    }

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          include: {
            school: true,
          },
        },
        documents: true,
      },
    });

    res.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: { id, userId: req.user.id },
      include: {
        course: {
          include: {
            school: true,
          },
        },
        user: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      return res.status(400).json({ error: 'Application already submitted' });
    }

    // Validate required fields
    if (!application.dateOfBirth || !application.nationality || !application.personalStatement) {
      return res.status(400).json({ error: 'Please complete all required fields' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        course: {
          include: {
            school: true,
          },
        },
      },
    });

    // Send confirmation email
    await sendEmail({
      to: application.user.email,
      subject: 'Application Submitted Successfully',
      html: `
        <h2>Application Submitted</h2>
        <p>Dear ${application.user.firstName},</p>
        <p>Your application for <strong>${application.course.name}</strong> at <strong>${application.course.school.name}</strong> has been submitted successfully.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <p>Best regards,<br>Sahara Student Services</p>
      `,
    });

    res.json({
      message: 'Application submitted successfully',
      application: updated,
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Upload document request:', {
      user: req.user?.id,
      file: req.file ? { name: req.file.originalname, size: req.file.size, type: req.file.mimetype } : null,
      params: req.params
    });

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { id } = req.params;

    // Verify ownership
    const application = await prisma.application.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const file = req.file as any; // Multer file with S3 or local storage properties
    
    const document = await prisma.document.create({
      data: {
        applicationId: id,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        s3Key: file.key || file.filename,
        s3Url: file.location || `/uploads/${file.filename}`,
      },
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id, documentId } = req.params;

    // Verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        application: {
          id,
          userId: req.user.id,
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({ where: { id: documentId } });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id, documentId } = req.params;

    // Find document and verify access
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        application: {
          id,
        },
      },
      include: {
        application: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if user owns the application or is admin/counsellor
    const isOwner = document.application.userId === req.user.id;
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'COUNSELLOR';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get signed URL for download
    const downloadUrl = await getSignedUrl(document.s3Key);

    res.json({
      downloadUrl,
      fileName: document.fileName,
      fileType: document.fileType,
    });
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
};

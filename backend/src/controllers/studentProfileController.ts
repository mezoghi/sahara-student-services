import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const PROFILE_REQUIRED_FIELDS = [
  'dateOfBirth',
  'nationality',
  'address',
  'educationLevel',
  'currentInstitution',
  'major',
  'gpa',
  'englishLevel'
] as const;

type ProfileRequiredField = (typeof PROFILE_REQUIRED_FIELDS)[number];

const computeProfileCompletion = (data: Record<string, any>) => {
  const missingFields: ProfileRequiredField[] = PROFILE_REQUIRED_FIELDS.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  const completedCount = PROFILE_REQUIRED_FIELDS.length - missingFields.length;
  const completionPercentage = Math.round((completedCount / PROFILE_REQUIRED_FIELDS.length) * 100);

  return {
    completionPercentage,
    missingFields
  };
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.json({ profile: null });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const createOrUpdateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      dateOfBirth,
      nationality,
      address,
      educationLevel,
      currentInstitution,
      major,
      gpa,
      englishLevel,
      workExperience,
      personalStatement
    } = req.body;

    // Calculate completion percentage + missing fields (for better UX)
    const { completionPercentage, missingFields } = computeProfileCompletion(req.body);

    // Upsert profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        nationality,
        address,
        educationLevel,
        currentInstitution,
        major,
        gpa,
        englishLevel,
        workExperience,
        personalStatement,
        profileCompletionPercentage: completionPercentage
      },
      create: {
        userId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        address,
        educationLevel,
        currentInstitution,
        major,
        gpa,
        englishLevel,
        workExperience,
        personalStatement,
        profileCompletionPercentage: completionPercentage
      }
    });

    res.json({
      message: 'Profile saved successfully',
      profile,
      meta: {
        completionPercentage,
        missingFields
      }
    });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

export const getProfileCompletion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    const completionPercentage = profile?.profileCompletionPercentage || 0;

    // Return missing fields based on stored profile so UI can render a checklist
    const { missingFields } = computeProfileCompletion(profile || {});

    // Business rule: block application submission until profile is at least 80% complete
    const blockingReasons = completionPercentage < 80 ? ['PROFILE_INCOMPLETE'] : [];

    res.json({
      completionPercentage,
      missingFields,
      blockingReasons
    });
  } catch (error) {
    console.error('Get completion error:', error);
    res.status(500).json({ error: 'Failed to get completion percentage' });
  }
};

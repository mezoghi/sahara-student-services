import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      isActive: true,
    };

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { name: 'asc' },
        include: {
          courses: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
        },
      }),
      prisma.school.count({ where }),
    ]);

    res.json({
      schools,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
};

export const getSchoolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        courses: {
          where: { isActive: true },
          orderBy: { level: 'asc' },
        },
      },
    });

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    res.json({ school });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ error: 'Failed to fetch school' });
  }
};

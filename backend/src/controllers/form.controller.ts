import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getFormFields = async (req: Request, res: Response) => {
  try {
    const fields = await prisma.formField.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    res.json({ fields });
  } catch (error) {
    console.error('Get form fields error:', error);
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
};

export const createFormField = async (req: AuthRequest, res: Response) => {
  try {
    const { label, fieldType, placeholder, required, options, order } = req.body;

    const field = await prisma.formField.create({
      data: {
        label,
        fieldType,
        placeholder,
        required,
        options,
        order,
      },
    });

    res.status(201).json({
      message: 'Form field created successfully',
      field,
    });
  } catch (error) {
    console.error('Create form field error:', error);
    res.status(500).json({ error: 'Failed to create form field' });
  }
};

export const updateFormField = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const field = await prisma.formField.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: 'Form field updated successfully',
      field,
    });
  } catch (error) {
    console.error('Update form field error:', error);
    res.status(500).json({ error: 'Failed to update form field' });
  }
};

export const deleteFormField = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.formField.delete({ where: { id } });

    res.json({ message: 'Form field deleted successfully' });
  } catch (error) {
    console.error('Delete form field error:', error);
    res.status(500).json({ error: 'Failed to delete form field' });
  }
};

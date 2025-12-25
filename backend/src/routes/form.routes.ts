import { Router } from 'express';
import * as formController from '../controllers/form.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /api/forms/fields:
 *   get:
 *     summary: Get all form fields
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: List of form fields
 */
router.get('/fields', formController.getFormFields);

// Admin only routes
router.post('/fields', authenticate, authorize(UserRole.ADMIN), formController.createFormField);
router.put('/fields/:id', authenticate, authorize(UserRole.ADMIN), formController.updateFormField);
router.delete('/fields/:id', authenticate, authorize(UserRole.ADMIN), formController.deleteFormField);

export default router;

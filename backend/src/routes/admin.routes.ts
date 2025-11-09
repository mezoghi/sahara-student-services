import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require admin or counsellor authentication
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.COUNSELLOR));

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Get all applications (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all applications
 */
router.get('/applications', adminController.getAllApplications);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   get:
 *     summary: Get application details (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application details
 */
router.get('/applications/:id', adminController.getApplicationDetails);

/**
 * @swagger
 * /api/admin/applications/{id}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/applications/:id/status', adminController.updateApplicationStatus);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', authorize(UserRole.ADMIN), adminController.getAllUsers);

export default router;

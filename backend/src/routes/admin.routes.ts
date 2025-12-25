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

// Course management routes
/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get all courses (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/courses', adminController.getAllCourses);

/**
 * @swagger
 * /api/admin/courses:
 *   post:
 *     summary: Create a new course (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               schoolId:
 *                 type: string
 *               level:
 *                 type: string
 *               duration:
 *                 type: integer
 *               tuitionFee:
 *                 type: number
 *               currency:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               startDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post('/courses', adminController.createCourse);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   put:
 *     summary: Update a course (admin/counsellor)
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
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *               duration:
 *                 type: integer
 *               tuitionFee:
 *                 type: number
 *               currency:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               startDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put('/courses/:id', adminController.updateCourse);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   delete:
 *     summary: Delete a course (admin only)
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
 *         description: Course deleted successfully
 */
router.delete('/courses/:id', authorize(UserRole.ADMIN), adminController.deleteCourse);

/**
 * @swagger
 * /api/admin/courses/bulk:
 *   put:
 *     summary: Bulk update courses (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               updates:
 *                 type: object
 *     responses:
 *       200:
 *         description: Courses updated successfully
 */
router.put('/courses/bulk', adminController.bulkUpdateCourses);

/**
 * @swagger
 * /api/admin/universities:
 *   get:
 *     summary: Get all universities (admin/counsellor)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all universities
 */
router.get('/universities', adminController.getAllUniversities);

export default router;

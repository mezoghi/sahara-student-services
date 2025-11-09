import { Router } from 'express';
import { body } from 'express-validator';
import * as applicationController from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/', applicationController.getUserApplications);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created
 */
router.post(
  '/',
  [body('courseId').notEmpty()],
  applicationController.createApplication
);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
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
router.get('/:id', applicationController.getApplicationById);

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update application (save draft)
 *     tags: [Applications]
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
 *         description: Application updated
 */
router.put('/:id', applicationController.updateApplication);

/**
 * @swagger
 * /api/applications/{id}/submit:
 *   post:
 *     summary: Submit application
 *     tags: [Applications]
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
 *         description: Application submitted
 */
router.post('/:id/submit', applicationController.submitApplication);

/**
 * @swagger
 * /api/applications/{id}/documents:
 *   post:
 *     summary: Upload document to application
 *     tags: [Applications]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded
 */
router.post(
  '/:id/documents',
  upload.single('file'),
  applicationController.uploadDocument
);

/**
 * @swagger
 * /api/applications/{id}/documents/{documentId}/download:
 *   get:
 *     summary: Download document
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document download URL
 */
router.get('/:id/documents/:documentId/download', applicationController.downloadDocument);

/**
 * @swagger
 * /api/applications/{id}/documents/{documentId}:
 *   delete:
 *     summary: Delete document
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted
 */
router.delete('/:id/documents/:documentId', applicationController.deleteDocument);

export default router;

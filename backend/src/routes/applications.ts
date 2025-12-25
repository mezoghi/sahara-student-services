import { Router } from 'express';
import { getApplications, createApplication, getApplicationById, uploadDocument, submitApplication, updateApplicationDraft } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/applications - Get all applications for current user
router.get('/', getApplications);

// POST /api/applications - Create new application
router.post('/', createApplication);

// GET /api/applications/:id - Get specific application
router.get('/:id', getApplicationById);

// PATCH /api/applications/:id - Update an existing draft
router.patch('/:id', updateApplicationDraft);

// POST /api/applications/:id/submit - Submit existing draft application
router.post('/:id/submit', submitApplication);

// POST /api/applications/:id/documents - Upload document for application
router.post('/:id/documents', upload.single('file'), uploadDocument);

export default router;

import { Router } from 'express';
import { getStudentProfile, createOrUpdateStudentProfile, getProfileCompletion } from '../controllers/studentProfileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/student/profile - Get student profile
router.get('/profile', getStudentProfile);

// POST /api/student/profile - Create or update student profile
router.post('/profile', createOrUpdateStudentProfile);

// GET /api/student/completion - Get profile completion percentage
router.get('/completion', getProfileCompletion);

export default router;

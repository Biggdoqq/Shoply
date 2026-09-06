import express from 'express';
import {
  getSettings,
  getAdminSettings,
  updateSettings,
  testTelegram
} from '../controllers/settingsController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', getSettings);
router.get('/admin', requireAdmin, getAdminSettings);
router.put('/', requireAdmin, updateSettings);
router.post('/test-telegram', requireAdmin, testTelegram);

export default router;

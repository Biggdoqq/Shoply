import express from 'express';
import {
  getSettings,
  updateSettings,
  testTelegram
} from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/test-telegram', testTelegram);

export default router;

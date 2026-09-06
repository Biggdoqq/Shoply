import express from 'express';
import {
  authenticateAdminPin,
  createAdminToken,
  requireAdmin,
} from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const pin = String(req.body?.pin || '');
    if (!authenticateAdminPin(pin)) {
      return res.status(401).json({ error: 'Invalid admin PIN.' });
    }

    return res.json({ token: createAdminToken(), expiresIn: 12 * 60 * 60 });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.get('/session', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

export default router;

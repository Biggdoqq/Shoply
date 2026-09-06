import express from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/adminAuth.js';
import prisma from '../prisma.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isAllowed = allowedMimeTypes.has(file.mimetype);
    if (isAllowed) return cb(null, true);

    const error = new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.');
    error.statusCode = 400;
    return cb(error);
  },
});

const router = express.Router();

const storeUploadedFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const media = await prisma.media.create({
      data: {
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        data: req.file.buffer,
        size: req.file.size,
      },
    });

    return res.json({
      url: `/api/upload/files/${media.id}`,
      filename: media.filename,
      size: media.size,
    });
  } catch (error) {
    return next(error);
  }
};

router.get('/files/:id', async (req, res, next) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) return res.status(404).json({ error: 'Image not found' });

    res.set({
      'Content-Type': media.mimeType,
      'Content-Length': String(media.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    return res.send(Buffer.from(media.data));
  } catch (error) {
    return next(error);
  }
});

router.post('/payment-proof', upload.single('image'), storeUploadedFile);
router.post('/', requireAdmin, upload.single('image'), storeUploadedFile);

router.post('/multiple', requireAdmin, upload.array('images', 5), async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded' });
  }

  try {
    const storedFiles = await prisma.$transaction(
      req.files.map((file) => prisma.media.create({
        data: {
          filename: file.originalname,
          mimeType: file.mimetype,
          data: file.buffer,
          size: file.size,
        },
      })),
    );

    return res.json({
      files: storedFiles.map((file) => ({
        url: `/api/upload/files/${file.id}`,
        filename: file.filename,
        size: file.size,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: error.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 3 MB or smaller.'
        : error.message,
    });
  }
  return next(error);
});

export default router;

import { Router } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/image', protect, adminOnly, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadImage);

export default router;

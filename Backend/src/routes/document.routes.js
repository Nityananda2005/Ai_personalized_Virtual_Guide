const express = require('express');
const multer = require('multer');
const { uploadDocument, queryDocument } = require('../controllers/document.controller');

const router = express.Router();

// Configure Multer for PDF file uploads (Memory storage, max 20MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

/**
 * Middleware wrapper for handling Multer upload errors gracefully
 */
const handleUploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('[Multer Upload Error]:', err);
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`,
      });
    } else if (err) {
      console.error('[Upload Middleware Error]:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed.',
      });
    }
    next();
  });
};

/**
 * POST /api/document/upload
 * Expects multipart/form-data with field name "file" (.pdf)
 */
router.post('/upload', handleUploadMiddleware, uploadDocument);

/**
 * POST /api/document/query
 * Expects JSON body { "query": "...", "language": "en" }
 */
router.post('/query', queryDocument);

module.exports = router;

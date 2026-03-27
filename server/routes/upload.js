import express from 'express';
import {
  uploadDriverDocuments,
  uploadUMKMDocuments,
  uploadProductImageController,
  uploadProfilePhotoController,
} from '../controllers/uploadController.js';
import {
  uploadDriverDocs,
  uploadUMKMDocs,
  uploadProductImage,
  uploadProfilePhoto,
} from '../middleware/upload.js';

const router = express.Router();

router.post('/driver', uploadDriverDocs, uploadDriverDocuments);
router.post('/umkm', uploadUMKMDocs, uploadUMKMDocuments);
router.post('/products', uploadProductImage, uploadProductImageController);
router.post('/profile', uploadProfilePhoto, uploadProfilePhotoController);

export default router;

import { Router } from 'express';
import { addProduct } from '../controllers/businessControllers';
import upload from '../config/multer';
import uploadImages from '../services/uploadImage';
import { authenticate } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Image Uploads
 *   description: Endpoints for uploading images
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image and associate it with a business, event, promo, or user
 *     tags: [Image Uploads]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - imageType
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *               imageType:
 *                 type: string
 *                 enum: [PROFILE_PICTURE, EVENT, PROMO, LOGO, BUSINESS_COVER]
 *                 description: Determines the target table and field to update
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The user ID (required for profile picture)
 *               businessId:
 *                 type: string
 *                 format: uuid
 *                 description: The business ID (required for LOGO, BUSINESS_COVER)
 *               imageTypeId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the record to update (required for EVENT or PROMO)
 *     responses:
 *       200:
 *         description: Image uploaded and associated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *                   format: uri
 *                 data:
 *                   type: object
 *                   description: The updated database record
 *       400:
 *         description: Invalid or missing parameters
 *       500:
 *         description: Server error
 */

const router = Router();
router.post('/image', authenticate, upload.single('image'), uploadImages);

export default router;

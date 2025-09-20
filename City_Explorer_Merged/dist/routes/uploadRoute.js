"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../config/multer"));
const uploadImage_1 = __importDefault(require("../services/uploadImage"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
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
 *     summary: Upload any type of image (profile picture, event, promo, product, logo, general)
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
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               imageType:
 *                 type: string
 *                 enum: [PROFILE_PICTURE, EVENT, PROMO, PRODUCT, LOGO, GENERAL]
 *                 description: Type of image to determine upload folder
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image file provided
 *       500:
 *         description: Server error
 */
const router = (0, express_1.Router)();
router.post('/image', authMiddleware_1.authenticate, multer_1.default.single('image'), uploadImage_1.default);
exports.default = router;

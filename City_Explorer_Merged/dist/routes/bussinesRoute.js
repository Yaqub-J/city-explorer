"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessController = __importStar(require("../controllers/businessControllers"));
const multer_1 = __importDefault(require("../config/multer"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Business account management
 */
/**
 * @swagger
 * /business/register:
 *   post:
 *     summary: Register a new business
 *     tags: [Business]
 *     security: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               longitude:
 *                 type: string
 *               latitude:
 *                 type: string
 *               openHours:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Business registered successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /business:
 *   get:
 *     summary: Get business details
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business details returned
 *       404:
 *         description: Business not found
 */
/**
 * @swagger
 * /business/all:
 *   get:
 *     summary: Get all businesses
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Businesses list
 *       404:
 *         description: No businesses found
 */
/**
 * @swagger
 * /business/update:
 *   patch:
 *     summary: Update business details
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: query
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               longitude:
 *                 type: string
 *               latitude:
 *                 type: string
 *               openHours:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 */
/**
 * @swagger
 * /business/delete:
 *   delete:
 *     summary: Delete business account
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found
 */
router.post('/register', multer_1.default.single('image'), businessController.registerBusiness);
router.get('/activate/:id', businessController.activateBusiness);
router.get('/', authMiddleware_1.authenticate, businessController.getBusinessDetails);
router.get('/all', authMiddleware_1.authenticate, businessController.getAllBusinesses);
router.patch('/update', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.updateBusinessDetails);
router.delete('/delete', authMiddleware_1.authenticate, businessController.deleteBusiness);
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Manage business events
 */
/**
 * @swagger
 * /business/event:
 *   post:
 *     summary: Add a new event to a business
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - date
 *               - paid
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               paid:
 *                 type: boolean
 *               amount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event added successfully
 *       400:
 *         description: Missing or invalid businessId
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/events:
 *   get:
 *     summary: Get all events for a business
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     responses:
 *       200:
 *         description: List of events
 *       400:
 *         description: Missing or invalid businessId
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/event:
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               paid:
 *                 type: boolean
 *               amount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Missing or invalid eventId
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/event:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Missing or invalid eventId
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/event', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.addEventToBusiness);
router.get('/events', authMiddleware_1.authenticate, businessController.getEvents);
router.patch('/event', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.updateEvent);
router.delete('/event', authMiddleware_1.authenticate, businessController.deleteEvent);
/**
 * @swagger
 * tags:
 *   name: Promos
 *   description: Manage business promotions
 */
/**
 * @swagger
 * /business/promo:
 *   post:
 *     summary: Add a new promotion to a business
 *     tags: [Promos]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Promo added successfully
 *       400:
 *         description: Missing or invalid businessId
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/promo:
 *   get:
 *     summary: Get all active promos for a business
 *     tags: [Promos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     responses:
 *       200:
 *         description: List of active promos
 *       400:
 *         description: Missing or invalid businessId
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/promo:
 *   patch:
 *     summary: Update an existing promo
 *     tags: [Promos]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: query
 *         name: promoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the promo to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Promo updated successfully
 *       400:
 *         description: Missing or invalid promoId
 *       404:
 *         description: Promo not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /business/promo:
 *   delete:
 *     summary: Delete a promo
 *     tags: [Promos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: promoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the promo to delete
 *     responses:
 *       200:
 *         description: Promo deleted successfully
 *       400:
 *         description: Missing or invalid promoId
 *       404:
 *         description: Promo not found
 *       500:
 *         description: Server error
 */
router.post('/promo', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.addPromo);
router.get('/promo', authMiddleware_1.authenticate, businessController.getPromos);
router.patch('/promo', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.updatePromo);
router.delete('/promo', authMiddleware_1.authenticate, businessController.deletePromo);
router.post('/:businessId/product', authMiddleware_1.authenticate, multer_1.default.single('image'), businessController.addProduct);
exports.default = router;

import { Router } from 'express';
import * as businessController from '../controllers/businessControllers';
import upload from '../config/multer';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

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


router.post('/register', upload.single('image'), businessController.registerBusiness);
router.get('/activate/:id', businessController.activateBusiness);
router.get('/', authenticate, businessController.getBusinessDetails);
router.get('/all', authenticate, businessController.getAllBusinesses);
router.patch('/update', authenticate, upload.single('image'), businessController.updateBusinessDetails);
router.delete('/delete', authenticate, businessController.deleteBusiness);

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


router.post('/event', authenticate, upload.single('image'), businessController.addEventToBusiness);
router.get('/events', authenticate, businessController.getEvents);
router.patch('/event', authenticate, upload.single('image'), businessController.updateEvent);
router.delete('/event', authenticate, businessController.deleteEvent);

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

router.post('/promo', authenticate, upload.single('image'), businessController.addPromo);
router.get('/promo', authenticate, businessController.getPromos);
router.patch('/promo', authenticate, upload.single('image'), businessController.updatePromo);
router.delete('/promo', authenticate, businessController.deletePromo);

router.post('/:businessId/product', authenticate, upload.single('image'), businessController.addProduct);

export default router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.deletePromo = exports.updatePromo = exports.getAllPromos = exports.getPromos = exports.addPromo = exports.deleteEvent = exports.updateEvent = exports.getAllEvents = exports.getEvents = exports.addEventToBusiness = exports.deleteBusiness = exports.updateBusinessDetails = exports.getAllBusinesses = exports.getBusinessDetails = exports.activateBusiness = exports.registerBusiness = void 0;
// import { PrismaClient } from '../generated/prisma';
const bcrypt_1 = require("bcrypt");
const uploadImage_1 = __importDefault(require("../services/uploadImage"));
const helper_1 = require("../helpers/helper");
const constants_1 = require("../constants/constants");
const prisma_1 = __importDefault(require("../helpers/prisma"));
// const prisma = new PrismaClient();
const API_BASE_URL = process.env.API_BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const registerBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, location, longitude, latitude, openHours, phone, email, password, website, description, role = "BUSINESS", } = req.body;
        if (!email || !password) {
            throw new Error("Please enter all required fields");
        }
        const existing = yield prisma_1.default.business.findUnique({
            where: { email_role: { email, role } },
        });
        if (existing)
            throw new Error("This email already exists");
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        let logoUrl;
        if (req.file) {
            logoUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.LOGO);
        }
        const newBusiness = yield prisma_1.default.business.create({
            data: {
                name,
                category,
                location,
                longitude,
                latitude,
                phone,
                email,
                website,
                description,
                role,
                logo: logoUrl,
                openHours: openHours || "9 AM - 5 PM", // Default open hours
                password: {
                    create: {
                        hashedPassword,
                    },
                },
            },
        });
        const activationLink = `${API_BASE_URL}/business/activate/${newBusiness.businessId}`;
        yield (0, helper_1.sendEmail)(email, "🎉 Activate Your City Explorer Account", '', `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #5b8df3;">Welcome to City Explorer, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">Thanks for signing up. You're one step away from discovering and promoting your business with us.</p>
          
          <p style="font-size: 16px;">Click the button below to activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" style="display: inline-block; background-color: #5b8df3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Activate My Account
            </a>
          </div>

          <p style="font-size: 14px; color: #999;">If you didn’t sign up for this account, you can safely ignore this email.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #ccc;">City Explorer Team</p>
        </div>
      </div>
      `);
        res.status(201).json({
            message: "Business registered successfully. Please check your email to activate your account.",
            business: Object.assign(Object.assign({}, newBusiness), { password: undefined }),
        });
    }
    catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
});
exports.registerBusiness = registerBusiness;
const activateBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const business = yield prisma_1.default.business.update({
            where: { businessId: id },
            data: { status: 'APPROVED' },
        });
        if (!business) {
            return res.status(404).send(`
        <html>
          <body>
            <h2>Activation failed</h2>
            <p>We couldn't find your account. Please try again or contact support.</p>
          </body>
        </html>
      `);
        }
        return res.status(200).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="5; />
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
          <h2>Account Activated ✅</h2>
          <p>Your account has been successfully activated!</p>
          <p>You can now return to the login page</a>.</p>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`
      <html>
        <body>
          <h2>Error Activating Account</h2>
          <p>Something went wrong. Please try again later.</p>
        </body>
      </html>
    `);
    }
});
exports.activateBusiness = activateBusiness;
const getBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const business = yield prisma_1.default.business.findUnique({
            where: { businessId },
            include: { items: true, events: true, promos: true },
        });
        if (!business)
            return res.status(404).json({ message: "Business not found" });
        res.status(200).json(business);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBusinessDetails = getBusinessDetails;
const getAllBusinesses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        const businesses = yield prisma_1.default.business.findMany({
            where: category
                ? {
                    category: {
                        equals: category,
                        mode: 'insensitive',
                    },
                    suspended: false
                }
                : undefined,
        });
        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found" });
        }
        res.status(200).json(businesses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllBusinesses = getAllBusinesses;
const updateBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Invalid businessId' });
        }
        if (!businessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }
        const existingBusiness = yield prisma_1.default.business.findUnique({ where: { businessId } });
        if (!existingBusiness) {
            return res.status(404).json({ message: 'Business not found' });
        }
        const { name, category, location, longitude, latitude, openHours, phone, email, website, description } = req.body;
        let logoUrl;
        if (req.file) {
            logoUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.LOGO);
        }
        const updatedBusiness = yield prisma_1.default.business.update({
            where: { businessId },
            data: Object.assign({ name,
                category,
                location, longitude: parseFloat(longitude), latitude: parseFloat(latitude), openHours,
                phone,
                email,
                website,
                description }, (logoUrl && { logo: logoUrl })),
        });
        res.status(200).json({ message: 'Business updated successfully', business: updatedBusiness });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateBusinessDetails = updateBusinessDetails;
const deleteBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const existingBusiness = yield prisma_1.default.business.findUnique({ where: { businessId } });
        if (!existingBusiness) {
            return res.status(404).json({ message: 'Business not found' });
        }
        yield prisma_1.default.business.delete({ where: { businessId } });
        res.status(200).json({ message: "Business deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteBusiness = deleteBusiness;
//EVENT
const addEventToBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const { title, description, location, longitude, latitude, date, paid, amount } = req.body;
        let eventImageUrl;
        if (req.file) {
            eventImageUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.EVENT);
        }
        const event = yield prisma_1.default.event.create({
            data: {
                title,
                description,
                location,
                longitude,
                latitude,
                date,
                businessId,
                paid,
                amount,
                images: eventImageUrl ? [eventImageUrl] : undefined
            },
        });
        res.status(201).json({ message: "Event added", event });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addEventToBusiness = addEventToBusiness;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.default.event.findMany();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllEvents = getAllEvents;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const events = yield prisma_1.default.event.findMany({ where: { businessId } });
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEvents = getEvents;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.query;
        if (!eventId || typeof eventId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid eventId' });
        }
        const existingEvent = yield prisma_1.default.event.findUnique({ where: { eventId } });
        if (!existingEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const allowedFields = [
            "title",
            "description",
            "location",
            "longitude",
            "latitude",
            "date",
            "paid",
            "amount"
        ];
        const dataToUpdate = (0, helper_1.buildUpdateData)(req.body, allowedFields);
        if (req.file) {
            const newImageUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.EVENT);
            dataToUpdate.images = { push: newImageUrl };
        }
        const updatedEvent = yield prisma_1.default.event.update({
            where: { eventId },
            data: dataToUpdate,
        });
        res.status(200).json({ message: "Event updated", event: updatedEvent });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.query;
        if (!eventId || typeof eventId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid eventId' });
        }
        const existingEvent = yield prisma_1.default.event.findUnique({ where: { eventId } });
        if (!existingEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        yield prisma_1.default.event.delete({ where: { eventId } });
        res.status(200).json({ message: "Event deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteEvent = deleteEvent;
//PROMOS
const addPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const { name, description, startDate, endDate } = req.body;
        let promoImageUrl;
        if (req.file) {
            promoImageUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.PROMO);
        }
        const promo = yield prisma_1.default.promo.create({
            data: {
                name,
                description,
                startDate,
                endDate,
                businessId,
                images: promoImageUrl ? [promoImageUrl] : undefined
            },
        });
        res.status(201).json({ message: "Promo added", promo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addPromo = addPromo;
const getPromos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId } = req.query;
        if (!businessId || typeof businessId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid businessId' });
        }
        const promos = yield prisma_1.default.promo.findMany({
            where: {
                businessId,
                endDate: {
                    gte: new Date(),
                }
            }
        });
        res.status(200).json(promos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPromos = getPromos;
const getAllPromos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promos = yield prisma_1.default.promo.findMany({
            where: {
                endDate: {
                    gte: new Date(),
                }
            }
        });
        res.status(200).json(promos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllPromos = getAllPromos;
const updatePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { promoId } = req.query;
        if (!promoId || typeof promoId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid promoId' });
        }
        const existingPromo = yield prisma_1.default.promo.findUnique({ where: { promoId } });
        if (!existingPromo) {
            return res.status(404).json({ message: 'Promo not found' });
        }
        const allowedFields = ["name", "description", "startDate", "endDate"];
        const dataToUpdate = (0, helper_1.buildUpdateData)(req.body, allowedFields);
        if (req.file) {
            const newImageUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.PROMO);
            dataToUpdate.images = { push: newImageUrl };
        }
        const updatedPromo = yield prisma_1.default.promo.update({
            where: { promoId },
            data: dataToUpdate,
        });
        res.status(200).json({ message: "Promo updated", promo: updatedPromo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updatePromo = updatePromo;
const deletePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { promoId } = req.query;
        if (!promoId || typeof promoId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid promoId' });
        }
        const existingPromo = yield prisma_1.default.promo.findUnique({ where: { promoId } });
        if (!existingPromo) {
            return res.status(404).json({ message: 'Promo not found' });
        }
        yield prisma_1.default.promo.delete({ where: { promoId } });
        res.status(200).json({ message: "Promo deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deletePromo = deletePromo;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const multerReq = req;
        const { businessId } = req.params;
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if business exists
        const business = yield prisma_1.default.business.findUnique({
            where: { businessId },
        });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const uploadResult = yield (0, uploadImage_1.default)(req, res);
        if (!uploadResult ||
            typeof uploadResult !== "object" ||
            !("url" in uploadResult)) {
            return;
        }
        const newProduct = yield prisma_1.default.item.create({
            data: {
                name,
                description,
                price,
                image: uploadResult.url,
                businessId,
            },
        });
        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addProduct = addProduct;

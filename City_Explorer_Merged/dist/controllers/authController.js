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
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.createUser = void 0;
// import { PrismaClient } from '@prisma/client';
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../helpers/helper");
const constants_1 = require("../constants/constants");
const prisma_1 = __importDefault(require("../helpers/prisma"));
let messages = [];
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User and business authentication
 */
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
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
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, BUSINESS]
 *                 default: USER
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture for the user
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error or duplicate account
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login for both users and businesses
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, BUSINESS]
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or missing fields
 */
// /**
//  * @swagger
//  * /forgot-password:
//  *   post:
//  *     summary: Request a password reset
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - role
//  *             properties:
//  *               email:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *                 enum: [USER, BUSINESS]
//  *     responses:
//  *       200:
//  *         description: Reset token generated
//  *       400:
//  *         description: Account not found or invalid role
//  */
// /**
//  * @swagger
//  * /reset-password:
//  *   post:
//  *     summary: Reset password using reset token
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - role
//  *               - resetToken
//  *               - newPassword
//  *             properties:
//  *               email:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *                 enum: [USER, BUSINESS]
//  *               resetToken:
//  *                 type: string
//  *               newPassword:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password reset successful
//  *       400:
//  *         description: Invalid or expired reset token
//  */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role = 'USER' } = req.body;
        if (!username || !email || !password) {
            throw new Error('Please fill in all fields');
        }
        const existing = yield prisma_1.default.user.findUnique({ where: { email_role: { email, role } } });
        if (existing)
            throw new Error(`Email already exists for a ${role.toLowerCase()} account`);
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        let imageUrl;
        if (req.file) {
            imageUrl = yield (0, helper_1.uploadImage)(req.file, constants_1.ImageType.PROFILE_PICTURE);
        }
        const user = yield prisma_1.default.user.create({
            data: {
                username,
                email,
                profilePic: imageUrl
            },
        });
        yield prisma_1.default.password.create({
            data: {
                hashedPassword,
                userId: user.userId,
            },
        });
        res.status(201).send({ message: `${role} account created successfully!` });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw new Error('Please fill in all fields including role');
        }
        if (role === 'USER') {
            const user = yield prisma_1.default.user.findUnique({ where: { email_role: { email, role } } });
            if (!user)
                throw new Error('User not found');
            const passwordRecord = yield prisma_1.default.password.findUnique({
                where: { userId: user.userId },
            });
            if (!passwordRecord)
                throw new Error('Password not found for user');
            const isMatch = yield (0, bcrypt_1.compare)(password, passwordRecord.hashedPassword);
            if (!isMatch)
                throw new Error('Incorrect password!');
            const userDetails = user;
            const token = jsonwebtoken_1.default.sign({ userId: user.userId, role: 'USER' }, process.env.JWT_SECRET, {
                expiresIn: '90d',
            });
            res.status(200).json({ token, details: userDetails });
        }
        else if (role === 'BUSINESS') {
            const business = yield prisma_1.default.business.findUnique({ where: { email_role: { email, role } } });
            if (!business)
                throw new Error('Business not found');
            const passwordRecord = yield prisma_1.default.password.findUnique({
                where: { businessId: business.businessId },
            });
            if (!passwordRecord)
                throw new Error('Password not found for business');
            const isMatch = yield (0, bcrypt_1.compare)(password, passwordRecord.hashedPassword);
            if (!isMatch)
                throw new Error('Incorrect password!');
            const token = jsonwebtoken_1.default.sign({ userId: business.businessId, role: 'BUSINESS' }, process.env.JWT_SECRET, {
                expiresIn: '90d',
            });
            res.status(200).json({ token, details: business });
        }
        else {
            throw new Error('Invalid role provided');
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = req.body;
        if (!email || !role)
            throw new Error("Email and role are required");
        let accountId;
        if (role === "USER") {
            const user = yield prisma_1.default.user.findUnique({ where: { email_role: { email, role } } });
            if (!user)
                throw new Error("User not found");
            accountId = user.userId;
        }
        else if (role === "BUSINESS") {
            const business = yield prisma_1.default.business.findUnique({ where: { email_role: { email, role } } });
            if (!business)
                throw new Error("Business not found");
            accountId = business.businessId;
        }
        else {
            throw new Error("Invalid role");
        }
        const crypto = yield Promise.resolve().then(() => __importStar(require("crypto")));
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Update or create Password record
        yield prisma_1.default.password.upsert({
            where: role === "USER"
                ? { userId: accountId }
                : { businessId: accountId },
            update: {
                resetToken: hashedResetToken,
                resetTokenExpires,
            },
            create: {
                resetToken: hashedResetToken,
                resetTokenExpires,
                userId: role === "USER" ? accountId : undefined,
                businessId: role === "BUSINESS" ? accountId : undefined,
                hashedPassword: "",
            },
        });
        console.log("Reset token (send via email):", resetToken);
        res.status(200).json({
            success: true,
            message: "Reset token generated. Please check your email.",
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, role, resetToken, newPassword } = req.body;
        if (!email || !role || !resetToken || !newPassword) {
            throw new Error("All fields are required");
        }
        // Hash the reset token to compare with stored hash
        const crypto = yield Promise.resolve().then(() => __importStar(require("crypto")));
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        let account;
        let accountId;
        if (role === "USER") {
            account = yield prisma_1.default.user.findUnique({ where: { email_role: { email, role } } });
            accountId = account === null || account === void 0 ? void 0 : account.userId;
        }
        else if (role === "BUSINESS") {
            account = yield prisma_1.default.business.findUnique({ where: { email_role: { email, role } } });
            accountId = account === null || account === void 0 ? void 0 : account.businessId;
        }
        else {
            throw new Error("Invalid role");
        }
        if (!account)
            throw new Error(`${role} not found`);
        const passwordRecord = yield prisma_1.default.password.findFirst({
            where: role === "USER"
                ? { userId: accountId }
                : { businessId: accountId },
        });
        if (!passwordRecord ||
            passwordRecord.resetToken !== hashedResetToken ||
            !passwordRecord.resetTokenExpires ||
            passwordRecord.resetTokenExpires < new Date()) {
            throw new Error("Invalid or expired reset token");
        }
        const newHashedPassword = yield (0, bcrypt_1.hash)(newPassword, 10);
        yield prisma_1.default.password.update({
            where: role === "USER"
                ? { userId: (_a = passwordRecord.userId) !== null && _a !== void 0 ? _a : undefined }
                : { businessId: (_b = passwordRecord.businessId) !== null && _b !== void 0 ? _b : undefined },
            data: {
                hashedPassword: newHashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.resetPassword = resetPassword;

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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { PrismaClient } from '../generated/prisma';
const prisma_1 = __importDefault(require("../helpers/prisma"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        if (!headerValue || !headerValue.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        const token = headerValue.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { userId, role } = decoded;
        if (role === 'USER') {
            const user = yield prisma_1.default.user.findUnique({ where: { userId } });
            if (!user)
                return res.status(401).json({ message: "User not found" });
            req.user = user;
        }
        else if (role === 'BUSINESS') {
            const business = yield prisma_1.default.business.findUnique({ where: { businessId: userId } });
            if (!business || business.status !== 'APPROVED') {
                return res.status(403).json({ message: "Business account is not active" });
            }
            if (business.suspended) {
                return res.status(403).json({ message: "Your business account is suspended, please contact admin for support" });
            }
            req.user = business;
        }
        else if (role === 'ADMIN') {
            const admin = yield prisma_1.default.admin.findUnique({ where: { adminId: userId } });
            if (!admin)
                return res.status(401).json({ message: "Admin not found" });
            req.user = admin;
        }
        else {
            return res.status(401).json({ message: "Invalid role" });
        }
        req.userRole = role;
        next();
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Unauthorized" });
    }
});
exports.authenticate = authenticate;

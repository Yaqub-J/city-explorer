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
exports.buildUpdateData = exports.sendEmail = exports.uploadImage = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
const uploadImage = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return;
    const result = yield cloudinary_1.v2.uploader.upload(file.path, { folder });
    return result.secure_url;
});
exports.uploadImage = uploadImage;
const sendEmail = (email, subject, text, html, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS,
        },
    });
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: email,
        subject,
        html,
        attachments,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        // logger.log('Email sent: %s', info.messageId) // For logging purposes
        return info;
    }
    catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
function buildUpdateData(body, allowedFields) {
    const updateData = {};
    for (const key of allowedFields) {
        const value = body[key];
        if (value !== undefined && value !== null) {
            updateData[key] = value;
        }
    }
    return updateData;
}
exports.buildUpdateData = buildUpdateData;

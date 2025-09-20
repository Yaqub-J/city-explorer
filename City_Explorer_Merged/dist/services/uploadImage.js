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
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const constants_1 = require("../constants/constants");
const prisma_1 = __importDefault(require("../helpers/prisma"));
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageType, targetId } = req.body;
        if (!imageType) {
            throw new Error('Missing imageType');
        }
        const config = constants_1.TableConfig[imageType];
        if (!config) {
            throw new Error('Invalid imageType');
        }
        const file = req.file;
        if (!file) {
            throw new Error('Missing or invalid image');
            ;
        }
        if (!targetId || typeof targetId !== 'string') {
            throw new Error('Missing or invalid target ID');
        }
        let folder = constants_1.ImageType.GENERAL;
        switch (imageType) {
            case constants_1.ImageType.PROFILE_PICTURE:
                folder = constants_1.ImageType.PROFILE_PICTURE;
                break;
            case constants_1.ImageType.EVENT:
                folder = constants_1.ImageType.EVENT;
                break;
            case constants_1.ImageType.PROMO:
                folder = constants_1.ImageType.PROMO;
                break;
            case constants_1.ImageType.LOGO:
                folder = constants_1.ImageType.LOGO;
                break;
            case constants_1.ImageType.BUSINESS_COVER:
                folder = constants_1.ImageType.BUSINESS_COVER;
                break;
        }
        // Upload using in-memory buffer
        const base64Image = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64Image}`;
        // Upload to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(dataUri, {
            folder,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        });
        const imageUrl = result.secure_url;
        const data = config.isArray
            ? { [config.field]: { push: imageUrl } }
            : { [config.field]: imageUrl };
        const model = prisma_1.default[config.table];
        if (!model || typeof model.update !== 'function') {
            throw new Error(`Invalid table: ${config.table}`);
        }
        const updatedRecord = yield model.update({
            where: { [config.pk]: targetId },
            data,
        });
        return res.status(200).json({
            message: 'Image uploaded and saved successfully',
            url: imageUrl,
            data: updatedRecord,
        });
    }
    catch (error) {
        console.error('Upload failed:', error);
        return res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});
exports.default = uploadImages;

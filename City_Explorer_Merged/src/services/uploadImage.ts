import cloudinary from '../config/cloudinary';
import fs from 'fs';
import { Request, Response } from 'express';
import { ImageType, TableMaps, TableConfig } from '../constants/constants';
import prisma from '../helpers/prisma';

const uploadImages = async (req: Request, res: Response) => {
  try {

    const { imageType, targetId } = req.body;

    if (!imageType) {
      throw new Error('Missing imageType');
    }
    
    const config = TableConfig[imageType as keyof typeof TableConfig];
    if (!config) {
      throw new Error('Invalid imageType');
    }

    const file = req.file;
    if (!file) {
      throw new Error('Missing or invalid image');;
    }

    if (!targetId || typeof targetId !== 'string') {
      throw new Error('Missing or invalid target ID');
    }

    let folder = ImageType.GENERAL;
    switch (imageType) {
      case ImageType.PROFILE_PICTURE:
        folder = ImageType.PROFILE_PICTURE;
        break;
      case ImageType.EVENT:
        folder = ImageType.EVENT;
        break;
      case ImageType.PROMO:
        folder = ImageType.PROMO;
        break;
      case ImageType.LOGO:
        folder = ImageType.LOGO;
        break;
      case ImageType.BUSINESS_COVER:
        folder = ImageType.BUSINESS_COVER;
        break;
    }

    // Upload using in-memory buffer
    const base64Image = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    });

    const imageUrl = result.secure_url;

     const data = config.isArray
      ? { [config.field]: { push: imageUrl } }
      : { [config.field]: imageUrl };

     const model = (prisma as any)[config.table];
     if (!model || typeof model.update !== 'function') {
       throw new Error(`Invalid table: ${config.table}`);
     }
     const updatedRecord = await model.update({
      where: { [config.pk]: targetId },
      data,
    });

    return res.status(200).json({
      message: 'Image uploaded and saved successfully',
      url: imageUrl,
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

export default uploadImages;

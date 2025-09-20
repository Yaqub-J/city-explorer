import nodemailer from 'nodemailer';
import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (file: Express.Multer.File, folder: string): Promise<string | undefined> => {
  if (!file) return;

  const result = await cloudinary.uploader.upload(file.path, { folder });
  return result.secure_url;
};

export const sendEmail = async (
    email: string,
    subject: string,
    text: string,
    html: string,
    attachments?: Array<{ filename: string; content: any; contentType: string }>,
) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS,
        },
    })

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: email,
        subject,
        html,
        attachments,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        // logger.log('Email sent: %s', info.messageId) // For logging purposes
        return info
    } catch (error) {
        console.error('Error sending email: ', error)
        throw error
    }
}

export function buildUpdateData(body: Record<string, any>, allowedFields: string[]) {
  const updateData: Record<string, any> = {};

  for (const key of allowedFields) {
    const value = body[key];
    if (value !== undefined && value !== null) {
      updateData[key] = value;
    }
  }

  return updateData;
}

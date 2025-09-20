// import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { uploadImage } from '../helpers/helper';
import { ImageType } from '../constants/constants';
import prisma from '../helpers/prisma';


let messages: string[] = [];

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


const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'USER' } = req.body;

    if (!username || !email || !password) {
      throw new Error('Please fill in all fields');
    }

    const existing = await prisma.user.findUnique({ where: { email_role: { email, role } }})

    if (existing) throw new Error(`Email already exists for a ${role.toLowerCase()} account`);

    const hashedPassword = await hash(password, 10);

    let imageUrl: string | undefined
    if (req.file) {
          imageUrl = await uploadImage(req.file, ImageType.PROFILE_PICTURE);
        }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        profilePic: imageUrl
      },
    });

    await prisma.password.create({
      data: {
        hashedPassword,
        userId: user.userId,
      },
    });


    res.status(201).send({ message: `${role} account created successfully!` });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new Error('Please fill in all fields including role');
    }

    if (role === 'USER') {
      const user = await prisma.user.findUnique({ where: { email_role: { email, role } } });
      if (!user) throw new Error('User not found');

      const passwordRecord = await prisma.password.findUnique({
        where: { userId: user.userId },
      });
      if (!passwordRecord) throw new Error('Password not found for user');

      const isMatch = await compare(password, passwordRecord.hashedPassword);
      if (!isMatch) throw new Error('Incorrect password!');

      const userDetails = user;

      const token = jwt.sign({ userId: user.userId, role: 'USER' }, process.env.JWT_SECRET!, {
        expiresIn: '90d',
      });

      res.status(200).json({ token, details: userDetails });
    }

    else if (role === 'BUSINESS') {
      const business = await prisma.business.findUnique({ where: { email_role: { email, role } } });
      if (!business) throw new Error('Business not found');

      const passwordRecord = await prisma.password.findUnique({
        where: { businessId: business.businessId },
      });
      if (!passwordRecord) throw new Error('Password not found for business');

      const isMatch = await compare(password, passwordRecord.hashedPassword);
      if (!isMatch) throw new Error('Incorrect password!');

      const token = jwt.sign({ userId: business.businessId, role: 'BUSINESS' }, process.env.JWT_SECRET!, {
        expiresIn: '90d',
      });

      res.status(200).json({ token, details: business });
    }

    else {
      throw new Error('Invalid role provided');
    }

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) throw new Error("Email and role are required");

    let accountId: string | undefined;

    if (role === "USER") {
      const user = await prisma.user.findUnique({ where: { email_role: { email, role } } });
      if (!user) throw new Error("User not found");
      accountId = user.userId;
    } else if (role === "BUSINESS") {
      const business = await prisma.business.findUnique({ where: { email_role: { email, role } } });
      if (!business) throw new Error("Business not found");
      accountId = business.businessId;
    } else {
      throw new Error("Invalid role");
    }

    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update or create Password record
    await prisma.password.upsert({
      where:
        role === "USER"
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, role, resetToken, newPassword } = req.body;

    if (!email || !role || !resetToken || !newPassword) {
      throw new Error("All fields are required");
    }

    // Hash the reset token to compare with stored hash
    const crypto = await import("crypto");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    let account;
    let accountId;
    if (role === "USER") {
      account = await prisma.user.findUnique({ where: { email_role: { email, role } } });
      accountId = account?.userId
    } else if (role === "BUSINESS") {
      account = await prisma.business.findUnique({ where: { email_role: { email, role } } });
      accountId = account?.businessId
    } else {
      throw new Error("Invalid role");
    }

    if (!account) throw new Error(`${role} not found`);

    const passwordRecord = await prisma.password.findFirst({
      where:
        role === "USER"
          ? { userId: accountId }
          : { businessId: accountId },
    });

    if (
      !passwordRecord ||
      passwordRecord.resetToken !== hashedResetToken ||
      !passwordRecord.resetTokenExpires ||
      passwordRecord.resetTokenExpires < new Date()
    ) {
      throw new Error("Invalid or expired reset token");
    }

    const newHashedPassword = await hash(newPassword, 10);

    await prisma.password.update({
      where: role === "USER"
        ? { userId: passwordRecord.userId ?? undefined }
        : { businessId: passwordRecord.businessId ?? undefined },
      data: {
        hashedPassword: newHashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export { createUser, loginUser, forgotPassword, resetPassword };

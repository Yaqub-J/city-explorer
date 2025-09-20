import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { PrismaClient } from '../generated/prisma';
import prisma from '../helpers/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userRole?: 'USER' | 'BUSINESS' | 'ADMIN';
    }
  }
}

// const prisma = new PrismaClient();

interface AuthPayload {
  userId: string;
  role: 'USER' | 'BUSINESS' | 'ADMIN';
  email: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    
    if (!headerValue || !headerValue.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const token = headerValue.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    const { userId, role } = decoded;

    if (role === 'USER') {
      const user = await prisma.user.findUnique({ where: { userId } });

      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
    } else if (role === 'BUSINESS') {
      const business = await prisma.business.findUnique({ where: { businessId: userId } });

      if (!business || business.status !== 'APPROVED') {
        return res.status(403).json({ message: "Business account is not active" });
      }

      if (business.suspended) {
        return res.status(403).json({ message: "Your business account is suspended, please contact admin for support" });    
      }

      req.user = business;
    } else if (role === 'ADMIN') {
      const admin = await prisma.admin.findUnique({ where: { adminId: userId } });

      if (!admin) return res.status(401).json({ message: "Admin not found" });

      req.user = admin;
    } else {
      return res.status(401).json({ message: "Invalid role" });
    }

    req.userRole = role;
    next();
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

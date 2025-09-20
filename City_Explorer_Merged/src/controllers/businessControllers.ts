import { Request, Response } from "express";
// import { PrismaClient } from '../generated/prisma';
import { hash } from "bcryptjs";
import type { Request as ExpressRequest } from "express";
import uploadImages from "../services/uploadImage";
import { buildUpdateData, sendEmail, uploadImage } from "../helpers/helper";
import { ImageType } from "../constants/constants";
import prisma from '../helpers/prisma';

type MulterFile = Express.Multer.File;
interface MulterRequest extends ExpressRequest {
  file?: MulterFile;
}

// const prisma = new PrismaClient();
const API_BASE_URL = process.env.API_BASE_URL
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL


const registerBusiness = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      location,
      longitude,
      latitude,
      openHours,
      phone,
      email,
      password,
      website,
      description,
      role = "BUSINESS",
    } = req.body;

    if (!email || !password) {
      throw new Error("Please enter all required fields");
    }

    const existing = await prisma.business.findUnique({
      where: { email_role: { email, role } },
    });

    if (existing) throw new Error("This email already exists");

    const hashedPassword = await hash(password, 10);

    let logoUrl: string | undefined;
    if (req.file) {
      logoUrl = await uploadImage(req.file, ImageType.LOGO);
    }

    const newBusiness = await prisma.business.create({
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

    await sendEmail(
      email,
      "🎉 Activate Your City Explorer Account",
      '',
      `
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
      `
    );

    res.status(201).json({
      message: "Business registered successfully. Please check your email to activate your account.",
      business: { ...newBusiness, password: undefined },
    });
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

const activateBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.update({
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

  } catch (error: any) {
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
};

const getBusinessDetails = async (req: Request, res: Response) => {
  try {
     const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }

    const business = await prisma.business.findUnique({
      where: { businessId },
      include: { items: true, events: true, promos: true },
    });
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.status(200).json(business);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBusinesses = async (req: Request, res: Response) => {
  try {
   const { category } = req.query;

    const businesses = await prisma.business.findMany({
      where: category
        ? {
            category: {
              equals: category as string,
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateBusinessDetails = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Invalid businessId' });
    }

    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required' });
    }

    const existingBusiness = await prisma.business.findUnique({ where: { businessId } });
    if (!existingBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const {
      name,
      category,
      location,
      longitude,
      latitude,
      openHours,
      phone,
      email,
      website,
      description
    } = req.body;

    let logoUrl: string | undefined;
    if (req.file) {
      logoUrl = await uploadImage(req.file, ImageType.LOGO);
    }

    const updatedBusiness = await prisma.business.update({
      where: { businessId },
      data: {
        name,
        category,
        location,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        openHours,
        phone,
        email,
        website,
        description,
        ...(logoUrl && { logo: logoUrl })
      },
    });

    res.status(200).json({ message: 'Business updated successfully', business: updatedBusiness });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }
    const existingBusiness = await prisma.business.findUnique({ where: { businessId } });
    if (!existingBusiness) { 
      return res.status(404).json({ message: 'Business not found' });
    }

    await prisma.business.delete({ where: { businessId } });
    res.status(200).json({ message: "Business deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


//EVENT
const addEventToBusiness = async (req: Request, res: Response) => {
  try {
     const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }

    const { title, description, location, longitude, latitude, date, paid, amount } = req.body;

    let eventImageUrl: string | undefined;
    if (req.file) {
      eventImageUrl = await uploadImage(req.file, ImageType.EVENT);
    }

    const event = await prisma.event.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getEvents = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }
    const events = await prisma.event.findMany({ where: { businessId } });
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;

    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid eventId' });
    }

    const existingEvent = await prisma.event.findUnique({ where: { eventId } });
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

    const dataToUpdate = buildUpdateData(req.body, allowedFields);

    if (req.file) {
      const newImageUrl = await uploadImage(req.file, ImageType.EVENT);
      dataToUpdate.images = { push: newImageUrl };
    }

    const updatedEvent = await prisma.event.update({
      where: { eventId },
      data: dataToUpdate,
    });

    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;

    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid eventId' });
    }
    const existingEvent = await prisma.event.findUnique({ where: { eventId } });
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await prisma.event.delete({ where: { eventId } });
    res.status(200).json({ message: "Event deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//PROMOS
const addPromo = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }

    const { name, description, startDate, endDate } = req.body;

    let promoImageUrl: string | undefined;
    if (req.file) {
      promoImageUrl = await uploadImage(req.file, ImageType.PROMO);
    }

    const promo = await prisma.promo.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getPromos = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid businessId' });
    }

    const promos = await prisma.promo.findMany({ 
      where: { 
        businessId,
        endDate: {
          gte: new Date(),
        }
       }
      });
    res.status(200).json(promos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPromos = async (req: Request, res: Response) => {
  try {
    const promos = await prisma.promo.findMany({
      where: {
        endDate: {
          gte: new Date(),
        }
      }
    });
    res.status(200).json(promos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updatePromo = async (req: Request, res: Response) => {
  try {
    const { promoId } = req.query;

    if (!promoId || typeof promoId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid promoId' });
    }

    const existingPromo = await prisma.promo.findUnique({ where: { promoId } });
    if (!existingPromo) {
      return res.status(404).json({ message: 'Promo not found' });
    }

    const allowedFields = ["name", "description", "startDate", "endDate"];
    const dataToUpdate = buildUpdateData(req.body, allowedFields);

    if (req.file) {
      const newImageUrl = await uploadImage(req.file, ImageType.PROMO);
      dataToUpdate.images = { push: newImageUrl };
    }

    const updatedPromo = await prisma.promo.update({
      where: { promoId },
      data: dataToUpdate,
    });

    res.status(200).json({ message: "Promo updated", promo: updatedPromo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


const deletePromo = async (req: Request, res: Response) => {
  try {
    const { promoId } = req.query;

    if (!promoId || typeof promoId !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid promoId' });
    }
    const existingPromo = await prisma.promo.findUnique({ where: { promoId } });
    if (!existingPromo) {
      return res.status(404).json({ message: 'Promo not found' });
    }

    await prisma.promo.delete({ where: { promoId } });
    res.status(200).json({ message: "Promo deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const multerReq = req as MulterRequest;
    const { businessId } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { businessId },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const uploadResult = await uploadImages(req, res);

    if (
      !uploadResult ||
      typeof uploadResult !== "object" ||
      !("url" in uploadResult)
    ) {
      return;
    }

    const newProduct = await prisma.item.create({
      data: {
        name,
        description,
        price,
        image: uploadResult.url as string,
        businessId,
      },
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export {
  registerBusiness,
  activateBusiness,
  getBusinessDetails,
  getAllBusinesses,
  updateBusinessDetails,
  deleteBusiness,
  addEventToBusiness,
  getEvents,
  getAllEvents,
  updateEvent,
  deleteEvent,
  addPromo,
  getPromos,
  getAllPromos,
  updatePromo,
  deletePromo,
  addProduct,
};

import upload from "../config/multer";
import * as user from "../controllers/authController";
import { Router } from "express";
// import { protect } from "../middlewares/authMiddleware";

const router = Router();
router.post("/signup", upload.single('image'), user.createUser);




export default router
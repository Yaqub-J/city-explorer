
import { Router } from "express";
import {chatbot } from "../controllers/chatbot";




const router = Router();

router.post("/chatbot", chatbot);

// router.get("/chatbot/messages", messagesArray)
// router.get("/chatbot/:id", databaseReply)
  
export default router
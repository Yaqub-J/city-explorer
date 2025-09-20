import { Request, Response } from "express";
import runChat from "../services/chatbotService2";
// import { PrismaClient } from "../generated/prisma";

// const prisma = new PrismaClient()
// import type { RolePart } from "@google/generative-ai";
import prisma from '../helpers/prisma';

type RoleMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

const chatbot = async (req: Request, res: Response) => {
  try {
    const { id, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let history: RoleMessage[] = [];

    // Unregistered user
    if (!id) {
      const reply = await runChat(message, []);
      res.json({ message: reply ?? "" });
      return;
    }

    // Registered user
    const user = await prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        userMessages: true,
        botReplies: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct chat history
    for (let i = 0; i < user.userMessages.length; i++) {
      history.push(
        {
          role: "user",
          parts: [{ text: user.userMessages[i] }],
        },
        {
          role: "model",
          parts: [{ text: user.botReplies[i] ?? "" }],
        }
      );
    }

    const reply = await runChat(message, history);

    // Update conversation history
    await prisma.user.update({
      where: { userId: id },
      data: {
        userMessages: {
          push: message,
        },
        botReplies: {
          push: reply ?? "",
        },
      },
    });

    res.json({
      message: (reply ?? "").split("*").join(""),
    });

  } catch (error: any) {
    console.error("Chatbot Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { chatbot };

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
exports.chatbot = void 0;
const chatbotService2_1 = __importDefault(require("../services/chatbotService2"));
// import { PrismaClient } from "../generated/prisma";
// const prisma = new PrismaClient()
// import type { RolePart } from "@google/generative-ai";
const prisma_1 = __importDefault(require("../helpers/prisma"));
const chatbot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id, message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        let history = [];
        // Unregistered user
        if (!id) {
            const reply = yield (0, chatbotService2_1.default)(message, []);
            res.json({ message: reply !== null && reply !== void 0 ? reply : "" });
            return;
        }
        // Registered user
        const user = yield prisma_1.default.user.findUnique({
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
            history.push({
                role: "user",
                parts: [{ text: user.userMessages[i] }],
            }, {
                role: "model",
                parts: [{ text: (_a = user.botReplies[i]) !== null && _a !== void 0 ? _a : "" }],
            });
        }
        const reply = yield (0, chatbotService2_1.default)(message, history);
        // Update conversation history
        yield prisma_1.default.user.update({
            where: { userId: id },
            data: {
                userMessages: {
                    push: message,
                },
                botReplies: {
                    push: reply !== null && reply !== void 0 ? reply : "",
                },
            },
        });
        res.json({
            message: (reply !== null && reply !== void 0 ? reply : "").split("*").join(""),
        });
    }
    catch (error) {
        console.error("Chatbot Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.chatbot = chatbot;

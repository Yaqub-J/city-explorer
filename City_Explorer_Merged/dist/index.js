"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = require("./config/swagger");
// import { specs, swaggerOptions } from './config/swagger';
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const db_1 = require("./config/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatbotRoute_1 = __importDefault(require("./routes/chatbotRoute"));
const bussinesRoute_1 = __importDefault(require("./routes/bussinesRoute"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const businessControllers_1 = require("./controllers/businessControllers");
const authController_1 = require("./controllers/authController");
const authMiddleware_1 = require("./middlewares/authMiddleware");
dotenv.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const corsOptions = {
    origin: true, // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
};
app.options('*', (0, cors_1.default)(corsOptions));
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
});
// Serve the OpenAPI JSON specification
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.send(swagger_1.specs);
});
// Serve the Swagger UI HTML page
app.get('/api-docs', (req, res) => {
    const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.API_BASE_URL
        : 'http://localhost:3000';
    const specUrl = `${baseUrl}/swagger.json`;
    res.setHeader('Content-Type', 'text/html');
    res.send((0, swagger_1.getSwaggerHTML)(specUrl));
});
app.get('/api-docs/', (req, res) => {
    res.redirect('/api-docs');
});
const port = 3000;
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use("/user", userRoutes_1.default);
app.use("/", chatbotRoute_1.default);
app.use("/business", bussinesRoute_1.default);
// app.use("/business", uploadRoute)
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
app.use("/events", authMiddleware_1.authenticate, businessControllers_1.getAllEvents);
/**
 * @swagger
 * /promos:
 *   get:
 *     summary: Get all active promos
 *     tags: [Promos]
 *     responses:
 *       200:
 *         description: List of all active promos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promo'
 *       500:
 *         description: Server error
 */
app.use("/promos", authMiddleware_1.authenticate, businessControllers_1.getAllPromos);
app.use("/upload", uploadRoute_1.default);
app.use("/login", authController_1.loginUser);
app.options('/*', (0, cors_1.default)());
app.options('/chatbot', (0, cors_1.default)());
app.options('/user', (0, cors_1.default)());
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

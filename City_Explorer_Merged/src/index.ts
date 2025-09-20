import express from 'express';
import { specs, getSwaggerHTML } from './config/swagger';
// import { specs, swaggerOptions } from './config/swagger';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from "dotenv"
import { connectDB } from "./config/db"
import userRoutes from "./routes/userRoutes";
import chatbotRoute from "./routes/chatbotRoute";
import businessRoute from "./routes/bussinesRoute"
import uploadRoute from './routes/uploadRoute';
import { getAllEvents, getAllPromos } from './controllers/businessControllers';
import { loginUser } from './controllers/authController';
import { authenticate } from './middlewares/authMiddleware';

dotenv.config();
connectDB();

const app = express();
app.use(cors());

const corsOptions = {
  origin: true, // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.options('*', cors(corsOptions));

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
  res.send(specs);
});

// Serve the Swagger UI HTML page
app.get('/api-docs', (req, res) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.API_BASE_URL 
    : 'http://localhost:3000';
  
  const specUrl = `${baseUrl}/swagger.json`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(getSwaggerHTML(specUrl));
});

app.get('/api-docs/', (req, res) => {
  res.redirect('/api-docs');
});

const port = 3000;

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json())

app.use("/user", userRoutes)
app.use("/", chatbotRoute)
app.use("/business", businessRoute)
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
app.use("/events", authenticate, getAllEvents)

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
app.use("/promos", authenticate, getAllPromos)
app.use("/upload", uploadRoute);
app.use("/login", loginUser)

app.options('/*', cors());
app.options('/chatbot', cors());
app.options('/user', cors());



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



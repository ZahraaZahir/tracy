import 'dotenv/config';
import cors from 'cors';
import express, {Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import worldRoutes from './routes/world.routes.js';
import entityRoutes from './routes/entity.routes.js';
import {errorHandler} from './middleware/error.middleware.js';

const PORT = process.env.PORT || 3050;
const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Too many requests, try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());

app.use(globalLimiter);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`<h1>Tracy Backend is Running</h1>`);
});

app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    system: 'Tracy',
    uptime: process.uptime(),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/world', worldRoutes);
app.use('/api/v1/entities', entityRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] Tracy running at http://localhost:${PORT}`);
});

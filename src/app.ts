import 'dotenv/config';
import cors from 'cors';
import express, {Request, Response} from 'express';
import authRoutes from './routes/auth.routes.js';
import worldRoutes from './routes/world.routes.js';
import entityRoutes from './routes/entity.routes.js';
import {errorHandler} from './middleware/error.middleware.js';

const PORT = 3050;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/world', worldRoutes);
app.use('/api/v1/entities', entityRoutes);

app.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    system: 'Tracy',
    uptime: process.uptime(),
  });
});

app.get('/', async (req: Request, res: Response) => {
  res.send(`<h1>Tracy Backend is Running</h1>`);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] Tracy running at http://localhost:${PORT}`);
});

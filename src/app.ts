import 'dotenv/config';
import cors from 'cors';
import express, {Request, Response} from 'express';
import authRoutes from './routes/auth.routes.js';
import worldRoutes from './routes/world.routes.js';
import {prisma} from './lib/prisma.js';

const PORT = 3050;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/world', worldRoutes);

app.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    system: 'Tracy',
    uptime: process.uptime(),
  });
});

app.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.send(
      `<h1>Tracy Backend is Running</h1><p>Database connected successfully.</p>`,
    );
  } catch (error) {
    res
      .status(500)
      .send(`<h1>Tracy Backend is Running</h1><p>Database Error: ${error}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] Tracy running at http://localhost:${PORT}`);
});

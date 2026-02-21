import 'dotenv/config';
import express, {Request, Response} from 'express';
import {Pool} from 'pg';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '@prisma/client';

const PORT = 3050;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({connectionString: databaseUrl});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

const app = express();
app.use(express.json());

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

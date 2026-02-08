import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { env } from './config/env.js';
import financialRoutes from './routes/financialRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/financials', financialRoutes);
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`FinModel Lab API running on port ${env.port}`);
});

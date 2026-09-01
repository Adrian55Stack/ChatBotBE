import express, { json } from 'express';
import 'dotenv/config';
import cors from 'cors';

import chatRoutes from './src/routes/chatRoutes.js'

const app = express();
app.disable("x-powered-by");
app.use(json());
app.use(cors({
  origin: ['http://localhost:4200']
}));

app.use('/api', chatRoutes);

export default app;

app.listen(4000, () => console.log('Server running on port 4000'));
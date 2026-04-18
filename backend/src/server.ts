import cors from 'cors';
import express from 'express';

import { apiRouter } from './routes/api';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Medicine adherence backend listening on port ${port}`);
});

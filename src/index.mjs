import express from 'express';
import cors from 'cors';
import itunesRouter from '../routes/itunes.mjs';
const app = express();

// maybe create post variable

app.use('/itunes', itunesRouter);
app.use(express.json());
app.use(cors());

app.listen(8000);

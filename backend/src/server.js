import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT_NUMBER || 3000;

app.get('/', (res) => {
  res.json({ status: 200, message: 'hello from backend' });
});

app.listen(PORT, () => {
  console.log('Server is listening at port:' + PORT);
});

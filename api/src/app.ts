import express, { Request, Response } from 'express';
import routes from './routes/router';
const app = express();
const port = 3000;

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

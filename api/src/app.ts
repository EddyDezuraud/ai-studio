import express, { Request, Response } from 'express';
import analyser from './services/buttonClassifierService';
const app = express();
const port = 3000;

app.get('/', (_req: Request, res: Response) => {
  const nbToPredict = 120;
  const prediction = analyser(nbToPredict);
  
  res.send(`Prediction for ${nbToPredict} is ${prediction}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express, { Request, Response } from 'express';
import routes from './routes/router';
const app = express();
const port = 3033;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
      next()
})


app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

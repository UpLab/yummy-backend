import express from 'express';

export default function startServer() {
  const app = express();
  const port = 4000;

  app.get('/', (req, res) => {
    res.send(`Hello World! ${1_000_000_000_000}`);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

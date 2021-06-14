import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth';
import config from '../../constants/config';

const users = [
  {
    _id: '1',
    email: 'ihor@uplab.io',
    password: '1234',
  },
  {
    _id: '2',
    email: 'john@uplab.io',
    password: '1234',
  },
];

export default function addAuthRoutes(app) {
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return res.sendStatus(404);

    const accessToken = jwt.sign({ _id: user._id, email: user.email }, config.jwtAccessTokenSecret, {
      expiresIn: '5m',
    });
    return res.json({ accessToken });
  });

  app.get('/', authMiddleware, async (req, res) => {
    const { email } = req.user;
    return res.send(`Hello ${email}! ${1_000_000_000_000}`);
  });
}

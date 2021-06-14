import jwt from 'jsonwebtoken';
import authMiddleware, { authorize } from '../middlewares/auth';
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

function generateAccessToken(user) {
  const payload = { _id: user._id, email: user.email };
  return jwt.sign(payload, config.jwtAccessTokenSecret, {
    expiresIn: '5m',
  });
}

function generateRefreshToken(user) {
  const payload = { _id: user._id, email: user.email };
  return jwt.sign(payload, config.jwtRefreshTokenSecret, {
    expiresIn: '365d',
  });
}

let refreshTokens = [];

export default function addAuthRoutes(app) {
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return res.sendStatus(404);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // TODO: NON-PRODUCTION CODE
    refreshTokens.push(refreshToken);

    return res.json({ accessToken, refreshToken });
  });

  app.post('/api/token', (req, res) => {
    const { token: refreshToken } = req.body;

    // TODO: NON-PRODUCTION CODE
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    const user = authorize({ res, token: refreshToken, secret: config.jwtRefreshTokenSecret });

    const accessToken = generateAccessToken(user);
    return res.json({ accessToken });
  });

  app.post('/api/logout', (req, res) => {
    const { token: refreshToken } = req.body;
    refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

    return res.json({ status: 'success' });
  });

  app.get('/api/hello', authMiddleware, async (req, res) => {
    const { email } = req.user;
    return res.send(`Hello ${email}! ${1_000_000_000_000}`);
  });
}

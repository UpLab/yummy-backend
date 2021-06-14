import jwt from 'jsonwebtoken';
import config from '../../constants/config';

const secret = config.jwtAccessTokenSecret;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) return res.sendStatus(401);
  try {
    const decodedUser = jwt.verify(token, secret);
    req.user = decodedUser;
    return next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export default authMiddleware;

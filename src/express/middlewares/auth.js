import jwt from 'jsonwebtoken';
import config from '../../constants/config';

export function authorize({ res, token, secret }) {
  if (!token) return res.sendStatus(401);
  try {
    const decodedUser = jwt.verify(token, secret);
    return decodedUser;
  } catch (error) {
    return res.sendStatus(403);
  }
}
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  const user = authorize({ res, token, secret: config.jwtAccessTokenSecret });
  req.user = user;
  return next();
};

export default authMiddleware;

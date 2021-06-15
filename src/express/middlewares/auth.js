import AuthService from '../../services/AuthService';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) return res.sendStatus(401);
  try {
    const user = AuthService.verifyAccessToken(token);
    req.user = user;
    return next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export default authMiddleware;

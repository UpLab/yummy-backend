import AuthService from '../../services/AuthService';
import UsersService from '../../services/UsersService';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) return res.sendStatus(401);
  try {
    const jwtUser = AuthService.verifyAccessToken(token);
    req.jwtUser = jwtUser;
    req.getUser = () => UsersService.findById(jwtUser._id);
    return next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export default authMiddleware;

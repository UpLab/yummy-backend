import authMiddleware from '../middlewares/auth';
import UsersService from '../../services/UsersService';

export default function addAuthRoutes(app) {
  app.get('/api/auth/greet', authMiddleware, async (req, res) => {
    const { email } = req.jwtUser;
    return res.send(`Hello ${email}!`);
  });

  app.get('/api/auth/me', authMiddleware, async (req, res) => {
    return res.json(req.getUser());
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // TODO: validate email and password ?
    try {
      const { accessToken, refreshToken } = await UsersService.loginWithPassword({ email, password });
      return res.json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    // TODO: validate email and password ?
    try {
      await UsersService.createAccount({ email, password });
      const { accessToken, refreshToken } = UsersService.loginWithPassword({ email, password });
      return res.json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(403);
      return res.json({
        error: error.message,
      });
    }
  });

  app.post('/api/auth/token', (req, res) => {
    const { token: refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(403);

    console.log(refreshToken);
    try {
      const { accessToken } = UsersService.loginWithRefreshToken(refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const { token: refreshToken } = req.body;
    UsersService.logout(refreshToken);
    return res.json({ status: 'success' });
  });
}

import authMiddleware from '../middlewares/auth';
import UsersService from '../../services/UsersService';

export default function addAuthRoutes(app) {
  // TODO: remove this test route
  app.get('/api/hello', authMiddleware, async (req, res) => {
    const { email } = req.user;
    return res.send(`Hello ${email}! ${1_000_000_000_000}`);
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    // TODO: validate email and password ?
    try {
      const result = await UsersService.loginWithPassword({ email, password });
      const { accessToken, refreshToken } = result;
      return res.json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  });

  app.post('/api/token', (req, res) => {
    const { token: refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    try {
      const { accessToken } = UsersService.loginWithRefreshToken(refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
  });

  app.post('/api/logout', (req, res) => {
    const { token: refreshToken } = req.body;
    UsersService.logout(refreshToken);
    return res.json({ status: 'success' });
  });
}

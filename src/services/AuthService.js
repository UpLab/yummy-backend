import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../constants/config';

class AuthService {
  refreshTokens = [];

  isTokenExpiredError = (error) => error instanceof TokenExpiredError;

  generateAccessToken(user) {
    const payload = { _id: user._id, email: user.email };
    return jwt.sign(payload, config.jwtAccessTokenSecret, {
      expiresIn: '5s',
    });
  }

  generateRefreshToken(user) {
    const payload = { _id: user._id, email: user.email };
    const refreshToken = jwt.sign(payload, config.jwtRefreshTokenSecret, {
      expiresIn: '365d',
    });
    this.refreshTokens.push(refreshToken);

    return refreshToken;
  }

  issueNewAccessToken(refreshToken) {
    const decodedUser = this.verifyRefreshToken(refreshToken);
    return this.generateAccessToken(decodedUser);
  }

  verifyAccessToken(accessToken) {
    const decodedUser = jwt.verify(accessToken, config.jwtAccessTokenSecret);
    return decodedUser;
  }

  verifyRefreshToken(refreshToken) {
    // TODO: NON-PRODUCTION CODE

    if (!this.refreshTokens.includes(refreshToken)) {
      throw new Error('Refresh token is not valid');
    }
    const decodedUser = jwt.verify(refreshToken, config.jwtRefreshTokenSecret);
    return decodedUser;
  }

  invalidateRefreshToken(refreshToken) {
    this.refreshTokens = this.refreshTokens.filter((t) => t !== refreshToken);
  }
}

export default new AuthService();

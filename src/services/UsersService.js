import { omit } from 'lodash';
import bcrypt from 'bcrypt';
import AuthService from './AuthService';
import logger from '../utils/logger';

class UsersService {
  users = [];

  #privateFields = ['hashedPassword'];

  #omitPrivateFields = (user) => omit(user, this.#privateFields);

  async createAccount({ email, password }) {
    const user = this.findByEmail(email);
    if (user) throw new Error(`User with email ${email} is already registered`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = {
      _id: (this.users.length + 1).toString(),
      email,
      hashedPassword,
    };
    this.users.push(userDoc);

    logger.info(`Registered new user with email: ${userDoc.email}`);
  }

  async loginWithPassword({ email, password }) {
    const user = this.findByEmail(email, true);

    if (!user) throw new Error('User not found');

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) throw new Error('Incorrect password');

    const userWithoutPrivateFields = this.#omitPrivateFields(user);

    const accessToken = AuthService.generateAccessToken(userWithoutPrivateFields);
    const refreshToken = AuthService.generateRefreshToken(userWithoutPrivateFields);

    return { accessToken, refreshToken, user: userWithoutPrivateFields };
  }

  loginWithRefreshToken(refreshToken) {
    const accessToken = AuthService.issueNewAccessToken(refreshToken);
    return { accessToken };
  }

  logout(refreshToken) {
    AuthService.invalidateRefreshToken(refreshToken);
  }

  findById(id, shouldIncludePrivateFields) {
    const user = this.users.find((u) => u._id === id);
    if (!user) return null;
    if (shouldIncludePrivateFields) return user;
    return this.#omitPrivateFields(user);
  }

  findByEmail(email, shouldIncludePrivateFields) {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    if (shouldIncludePrivateFields) return user;
    return this.#omitPrivateFields(user);
  }
}

export default new UsersService();

import { omit } from 'lodash';
import bcrypt from 'bcrypt';
import AuthService from './AuthService';
import logger from '../utils/logger';
import MongoClientProvider from './MongoClientProvider';

class UsersService {
  collectionName = 'users';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  #privateFields = ['hashedPassword'];

  #omitPrivateFields = (user) => omit(user, this.#privateFields);

  async createAccount({ email, password }) {
    const user = await this.findByEmail(email);
    if (user) throw new Error(`User with email ${email} is already registered`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = {
      email,
      hashedPassword,
      createdAt: new Date(),
    };
    await this.getCollection().insert(userDoc);

    logger.info(`Registered new user with email: ${userDoc.email}`);
  }

  async loginWithPassword({ email, password }) {
    const user = await this.findByEmail(email, true);

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

  async findById(_id, shouldIncludePrivateFields) {
    const user = await this.getCollection().findOne({ _id });
    if (!user) return null;
    if (shouldIncludePrivateFields) return user;
    return this.#omitPrivateFields(user);
  }

  async findByEmail(email, shouldIncludePrivateFields) {
    const user = await this.getCollection().findOne({ email });
    if (!user) return null;
    if (shouldIncludePrivateFields) return user;
    return this.#omitPrivateFields(user);
  }
}

export default new UsersService();

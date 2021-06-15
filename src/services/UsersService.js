import { omit } from 'lodash';
import bcrypt from 'bcrypt';
import AuthService from './AuthService';

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

    console.log('Registered new user', userDoc);
  }

  async loginWithPassword({ email, password }) {
    const user = this.findByEmail(email, true);

    if (!user) throw new Error('User not found');

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) throw new Error('Incorrect password');

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    const userWithoutPrivateFields = this.#omitPrivateFields(user);

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

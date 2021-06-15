import bcrypt from 'bcrypt';
import AuthService from './AuthService';

class UsersService {
  users = [];

  async createAccount(params) {
    const { email, password } = params;

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
    const user = this.findByEmail(email);

    if (!user) throw new Error('User not found');

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) throw new Error('Incorrect password');

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    return { accessToken, refreshToken, user };
  }

  loginWithRefreshToken(refreshToken) {
    const accessToken = AuthService.issueNewAccessToken(refreshToken);
    return { accessToken };
  }

  logout(refreshToken) {
    AuthService.invalidateRefreshToken(refreshToken);
  }

  findById(id) {
    return this.users.find((u) => u._id === id);
  }

  findByEmail(email) {
    return this.users.find((u) => u.email === email);
  }
}

export default new UsersService();

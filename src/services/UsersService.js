import AuthService from './AuthService';

/* eslint-disable class-methods-use-this */
const users = [
  {
    _id: '1',
    email: 'ihor@uplab.io',
    password: '1234',
  },
  {
    _id: '2',
    email: 'john@uplab.io',
    password: '1234',
  },
];

class UsersService {
  users = users;

  createAccount(userDoc) {
    console.log(userDoc);
    // TODO:
  }

  loginWithPassword({ email, password }) {
    const user = this.findByEmail(email);

    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Incorrect password');

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

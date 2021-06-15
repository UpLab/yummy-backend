import UsersService from '../services/UsersService';

const defaultUsers = [
  {
    email: 'ihor@uplab.io',
    password: '1234',
  },
  {
    email: 'john@uplab.io',
    password: '1234',
  },
];

export default function fixtures() {
  defaultUsers.forEach((u) => {
    UsersService.createAccount(u);
  });
}

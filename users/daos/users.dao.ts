import debug from 'debug';
import { CreateUserDto } from '../dto/create.user.dto';
import { PrismaClient } from '@prisma/client';

const log: debug.IDebugger = debug('app:in-user-dao');

class UserDao {
  users: Array<CreateUserDto> = [];

  prisma = new PrismaClient();

  constructor() {
    log('Created new instance of UserDao');
  }

  async addUser(user: CreateUserDto) {
    const res = await this.prisma.user.create({
      data: user,
    });
    return res;
  }

  async getUsers() {
    return this.users;
  }

  async getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async putUserByEmail(email: string, user: CreateUserDto) {
    const objIndex = this.users.findIndex((user) => user.email === email);
    this.users.splice(objIndex, 1, user);
    return `${user.email} updated via put`;
  }

  async deleteUserByEmail(email: string) {
    const objIndex = this.users.findIndex((user) => user.email === email);
    this.users.splice(objIndex, 1);
    return `${email} removed`;
  }
}

export default new UserDao();

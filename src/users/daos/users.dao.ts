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

  async findUsers(skip: number, take: number) {
    return this.prisma.user.findMany({
      skip,
      take,
      select: {
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        permission: true,
      },
    });
  }

  async findUserCount() {
    return this.prisma.user.count();
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
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

  async findUserByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        permission: true,
      },
    });
  }
}

export default new UserDao();

import UsersDao from '../daos/users.dao';
import { CreateUserDto } from '../dto/create.user.dto';
import { CRUD } from '../../common/interfaces/crud.interface';
import { PutUserDto } from '../dto/put.user.dto';

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return UsersDao.deleteUserById(id);
  }

  async list(page: number, per_page: number) {
    const skip = per_page * (page - 1);
    const take = per_page;

    try {
      const list = await UsersDao.findUsers(skip, take);
      const count = await UsersDao.findUserCount();
      return { users: list, total: count };
    } catch (error) {
      // console.log(error);
      return null;
    }
  }

  async readById(id: string) {
    return UsersDao.findUserById(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return UsersDao.putUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.findUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return UsersDao.findUserByEmailWithPassword(email);
  }
}

export default new UsersService();

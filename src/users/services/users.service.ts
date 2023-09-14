import UsersDao from '../daos/users.dao';
import { CreateUserDto } from '../dto/create.user.dto';
import { CRUD } from '../../common/interfaces/crud.interface';
import { PutUserDto } from '../dto/put.user.dto';

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return UsersDao.deleteUserByEmail(id);
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers();
  }

  async readById(id: string) {
    return UsersDao.getUserByEmail(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return UsersDao.putUserByEmail(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return UsersDao.findUserByEmailWithPassword(email);
  }
}

export default new UsersService();

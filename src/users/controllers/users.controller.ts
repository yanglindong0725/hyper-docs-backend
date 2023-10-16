import argon2 from 'argon2';
import debug from 'debug';
import express from 'express';
import usersService from '../services/users.service';
import { passwordVerify } from '../../common/utils/validation';
import BodyValidationMiddleware from '../../common/middleware/body.validation.middleware';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const perPage = req.query.perPage ? Number(req.query.perPage) : 10;
    const users = await usersService.list(page, perPage);
    if (!users) {
      res.status(500).send({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    try {
      req.body.password = await argon2.hash(req.body.password);
      const userId = await usersService.create(req.body);
      res.status(201).send({ id: userId });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async put(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    // console.log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeUser(req: express.Request, res: express.Response) {
    // console.log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }
}

export default new UsersController();

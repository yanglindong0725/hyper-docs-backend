import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum';

const log: debug.IDebugger = debug('app:users-middlewares');

class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.email && req.body.password) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required fields email and password`,
      });
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      if (!('email' in req.body)) {
        next();
      }
      const user = await userService.getUserByEmail(req.body.email);
      if (user && user.id !== Number(req.params.userId)) {
        res.status(400).send({ error: `User email already exists` });
      } else {
        next();
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async validateOtherAttributesAndGiveDefault(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (!req.body.permission) {
      req.body.permission = 1;
    }
    if (!req.body.avatar) {
      req.body.avatar = 'https://www.gravatar.com/avatar/';
    }
    next();
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await userService.readById(req.params.userId);
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.userId;
    next();
  }

  async userCantChangePermission(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (
      'permission' in req.body &&
      !(PermissionFlag.ALL_PERMISSIONS & res.locals.jwt.permission)
    ) {
      res.status(400).send({
        errors: ['User cannot change permission flags'],
      });
    } else {
      next();
    }
  }

  // 验证邮箱属于同一用户，防止用户修改邮箱后与其他用户邮箱重复
  validateSameEmailBelongToSameUser(
    req: express.Request | any,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (res.locals.user.id === Number(req.params.userId)) {
      next();
    } else {
      res.status(400).send({ errors: ['Invalid email'] });
    }
  }
}

export default new UsersMiddleware();

import debug from 'debug';
import express from 'express';
import { PermissionFlag } from './common.permissionflag.enum';

const log: debug.IDebugger = debug('app:common-permissionFlags-middleware');

class CommonPermissionMiddleware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      try {
        const userPermissionFlags = parseInt(res.locals.jwt.permission);
        // console.log('userPermissionFlags', userPermissionFlags);
        // console.log('requiredPermissionFlag', requiredPermissionFlag);
        // console.log(userPermissionFlags & requiredPermissionFlag);
        if (userPermissionFlags & requiredPermissionFlag) {
          next();
        } else {
          res.status(403).send('ddd');
        }
      } catch (e) {
        log(e);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const userPermissionFlags = parseInt(res.locals.jwt.permission);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).send('bbb');
      }
    }
  }
}

export default new CommonPermissionMiddleware();

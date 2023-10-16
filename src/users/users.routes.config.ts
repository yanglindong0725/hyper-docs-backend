import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import express from 'express';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import { CommonRoutesConfig } from '../common/common.routes.config';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import { query, header, body } from 'express-validator';
import { passwordVerify } from '../common/utils/validation';
import usersController from './controllers/users.controller';
import usersMiddleware from './middleware/users.middleware';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes(): express.Application {
    const v1 = '/api/v1';
    this.app
      .route(`${v1}/users`)
      .all(
        header('Authorization')
          .exists()
          .withMessage('Authorization header is required'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
      )
      /**
       * @api {get} /api/v1/users List Users
       */
      .get(
        query('page').optional().isInt().withMessage('Must be an integer'),
        query('per_page').optional().isInt().withMessage('Must be an integer'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION,
        ),
        UsersController.listUsers,
      )
      /**
       * @api {post} /api/v1/users Create User
       */
      .post(
        body('email').isEmail().withMessage('Must be a valid email address'),
        body('password').custom(passwordVerify),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION,
        ),
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersMiddleware.validateOtherAttributesAndGiveDefault,
        UsersController.createUser,
      );

    this.app.param(`userId`, UsersMiddleware.extractUserId);
    this.app
      .route(`${v1}/users/:userId`)
      .all(
        UsersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put(`${v1}/users/:userId`, [
      body('email').isEmail().withMessage('Must be a valid email address').optional(),
      body('password').custom(passwordVerify).optional(),
      body('permission').isIn(Object.values(PermissionFlag)).optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      // 这个中间件好像没用
      // UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersMiddleware.userCantChangePermission,
      usersMiddleware.validateSameEmailDoesntExist,
      UsersController.put,
    ]);

    return this.app;
  }
}

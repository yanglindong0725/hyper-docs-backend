import express from 'express';
import usersService from '../../users/services/users.service';
import * as argon2 from 'argon2';

class AuthMiddleware {
  /**
   * @description Verifies if the user exists with the email with the password sent in the request body
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      req.body.email,
    );
    if (user) {
      const passwordHash = user.password;
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user.id,
          email: user.email,
          permission: user.permission,
        };
        return next();
      }
    }
    res.status(400).send({ errors: ['Invalid email and/or password'] });
  }
}

export default new AuthMiddleware();

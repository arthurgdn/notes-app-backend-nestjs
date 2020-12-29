import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../auth/auth.service';
import { User } from 'src/auth/user.schema';

export interface IGetUserAuthInfoRequest extends Request {
  user: User;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.authService.findById(decoded.id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}

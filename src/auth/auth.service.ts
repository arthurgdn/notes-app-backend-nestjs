import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findById(id: number): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }
    return user;
  }
}

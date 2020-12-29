import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { validate } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { CreateUserDto, LoginUserDto } from './user.dto';
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

  async findOne({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async create(dto: CreateUserDto): Promise<User> {
    // check uniqueness of username/email
    const preExistingUser = await this.findByEmail(dto.email);

    if (preExistingUser) {
      const errors = { username: 'Email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new this.userModel({
      _id: Types.ObjectId(),
      ...dto,
    });
    console.log('user', user);
    const errors = await validate(user);
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return await user.save();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  public generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      process.env.JWT_SECRET,
    );
  }
}

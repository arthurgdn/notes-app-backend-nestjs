import { Get, Post, Body, Controller, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User as UserModel } from './user.schema';
import { User } from './user.decorator';
import { ValidationPipe } from '../common/validation.pipe';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //User should be able to fetch his profile
  @Get('')
  async findMe(@User('email') email: string): Promise<UserModel> {
    return await this.authService.findByEmail(email);
  }

  //User should be able to create his account
  @UsePipes(new ValidationPipe())
  @Post('')
  async create(@Body('user') userData: CreateUserDto) {
    return this.authService.create(userData);
  }

  //User should be able to login
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<any> {
    const _user = await this.authService.findOne(loginUserDto);
    console.log(_user);
    const errors = { User: ' not found' };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.authService.generateJWT(_user);
    const { email, name } = _user;
    const user = { email, token, name };
    return { user };
  }
}

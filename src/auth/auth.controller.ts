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

  @Get('auth')
  async findMe(@User('email') email: string): Promise<UserModel> {
    return await this.authService.findByEmail(email);
  }

  @UsePipes(new ValidationPipe())
  @Post('auth')
  async create(@Body('user') userData: CreateUserDto) {
    return this.authService.create(userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('auth/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<any> {
    const _user = await this.authService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.authService.generateJWT(_user);
    const { email, name } = _user;
    const user = { email, token, name };
    return { user };
  }
}

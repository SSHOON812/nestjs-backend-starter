import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponseDto } from 'src/common/base_reponse.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  //유저 email 중복확인
  @Get("check-email")
  async checkEmail(
    @Query('email') email: string,
  ): Promise<BaseResponseDto> {
    return this.usersService.checkEmail(email);
  }


  //회원가입
  @Post("join-user")
  async joinUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.joinUser(createUserDto);
  }


}

import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from 'src/common/base_reponse.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { };

  async login(loginDto: LoginDto): Promise<{ access: string, refresh: string }> {

    const user = await this.userService.login(loginDto);

    const payload = {
      sub: user.userSeq,
      email: user.userEmail,
      level: user.userLevel,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      sub: user.userSeq,
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH,
      expiresIn: process.env.JWT_REFRESH_EXPIRE as any,
    });

    await this.userService.updateLastLoginDate(user.userEmail);

    return {
      access: accessToken,
      refresh: refreshToken
    }


  }


}

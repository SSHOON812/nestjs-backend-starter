import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      secret: this.configService.get<string>('JWT_REFRESH'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE') as JwtSignOptions['expiresIn'],
    });

    await this.userService.updateLastLoginDate(user.userEmail);

    return {
      access: accessToken,
      refresh: refreshToken
    }


  }


  async refresh(userSeq: number): Promise<{ access: string }> {
    const user = await this.userService.findUserDoubleCheck(userSeq);

    const payload = {
      sub: user.userSeq,
      email: user.userEmail,
      level: user.userLevel,
    };

    return {
      access: this.jwtService.sign(payload),
    };
  }


}

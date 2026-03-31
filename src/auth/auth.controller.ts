import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access: string, refresh: string }> {
    return this.authService.login(loginDto);
  }


  @Post("refresh")
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(
    @Req() req
  ): Promise<{ access: string }> {
    return this.authService.refresh(req.user.userSeq);
  }




}

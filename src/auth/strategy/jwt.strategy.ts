import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "src/users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET'),
        });
    };

    async validate(payload: any) {

        const user = await this.usersService.findUserDoubleCheck(payload.sub);

        if (!user) {
            throw new UnauthorizedException('로그인 실패');
        }


        return {
            userSeq: user.userSeq,
            userEmail: user.userEmail,
            role: user.userLevel
        }
    }


}
import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AUTH_KEY, AuthOptions } from "../decorators/auth.decorator";
import { Role } from "src/roles/entities/role.entity";
import { UserRole } from "src/users/enums/user-role.enum";

export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const options = this.reflector.getAllAndOverride<AuthOptions>(
            AUTH_KEY,
            [context.getHandler(), context.getClass()],
        );


        if (!options) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;


        if (!user) {
            throw new ForbiddenException('로그인이 필요합니다.');
        }

        const role: UserRole = user.role;


        if (options.only !== undefined) {
            if (role !== options.only) {
                throw new ForbiddenException('권한이 없습니다.');
            }
        }

        if (options.anyOf) {
            if (!options.anyOf.includes(role)) {
                throw new ForbiddenException('권한이 없습니다.');
            }
        }

        if (options.minRole !== undefined) {
            if (role < options.minRole) {
                throw new ForbiddenException('권한이 부족합니다.');
            }
        }

        if (options.maxRole !== undefined) {
            if (role > options.maxRole) {
                throw new ForbiddenException('권한 범위를 초과했습니다.');
            }
        }

        return true;

    }
}
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        const userRole: UserRole = user.role;

        const permission = requiredRoles.some(role => userRole >= role);

        if (!permission) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        return true;

    }

}
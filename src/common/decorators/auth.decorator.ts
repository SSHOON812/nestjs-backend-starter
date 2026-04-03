import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/enums/user-role.enum";

export const AUTH_KEY = 'auth';

export interface AuthOptions {
    minRole?: UserRole;
    maxRole?: UserRole;
    only: UserRole;
    anyOf: UserRole[];
}

export const Auth = (options: AuthOptions) => SetMetadata(AUTH_KEY, options);
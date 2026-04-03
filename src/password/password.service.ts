import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';


@Injectable()
export class PasswordService {

    // 비번 -> 해쉬
    async transferHash(password: string): Promise<string> {
        return argon2.hash(password)
    }

    // 검증
    async verify(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

}
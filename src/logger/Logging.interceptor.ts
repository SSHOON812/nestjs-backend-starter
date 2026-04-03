import { CallHandler, ExecutionContext, Injectable, LoggerService, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    /* nest 기본 logger 파일로 남지 않음
    private readonly logger = new Logger('HTTP'); */

    constructor(private readonly logger: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, user } = req;
        const userinfo = user ? `[USER: ${user.userSeq}]` : `[GUEST]`;
        const start = Date.now();

        return next.handle().pipe(

            tap(() => {
                const res = context.switchToHttp().getResponse();
                const time = Date.now() - start;

                this.logger.log(
                    `${userinfo} ${method} ${url} ${res.statusCode} - ${time}ms`,
                );
            }),
        );
    }
}
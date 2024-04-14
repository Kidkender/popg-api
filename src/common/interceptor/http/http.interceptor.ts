import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpInterceptor.name);
  private readonly routeWithoutTimeout: string[] = [];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    const shouldTimeOut = !this.routeWithoutTimeout.some((route) =>
      url.includes(route),
    );

    return next.handle().pipe(
      shouldTimeOut ? timeout(5000) : (obs) => obs,

      catchError((error: AxiosError) => {
        if (error instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }

        const errorMessage = error.response?.data
          ? error.response.data
          : error.message;
        const status = error.status
          ? error.status
          : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error('Request error: ' + errorMessage);
        return throwError(() => new HttpException(errorMessage, status));
      }),
    );
  }
}

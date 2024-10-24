import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export function createInfo(statusCode: number = 200): {
  message: string;
  statusCode: number;
} {
  return {
    statusCode,
    message: 'success',
  };
}

export type Response<T> = {
  statusCode: number;
  message: string;
  body: T;
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse();
    const status = res.statusCode;

    return next.handle().pipe(
      map((data) => ({
        ...createInfo(status),
        body: data,
      })),
    );
  }
}

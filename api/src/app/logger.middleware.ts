import {Injectable, NestMiddleware, Logger} from '@nestjs/common';

import {Request, Response, NextFunction} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const {ip, method, originalUrl: path} = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const {statusCode} = response;
      const contentLength = response.get('content-length');

      this.logger.log(`${method} ${path} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });

    next();
  }
}

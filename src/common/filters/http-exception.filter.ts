import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
  
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: exception.getResponse(),
      };
  
      // Handle validation errors specifically
      if (status === HttpStatus.BAD_REQUEST) {
        const responseBody = exception.getResponse();
        if (typeof responseBody === 'object' && responseBody['message']) {
          errorResponse.message = responseBody['message'];
        }
      }
  
      response.status(status).json(errorResponse);
    }
  }
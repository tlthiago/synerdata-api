import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json({
        succeeded: false,
        data: null,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Erro desconhecido',
        error: exceptionResponse,
      });
    } else if (exception instanceof QueryFailedError) {
      const queryError = exception as QueryFailedError;
      console.error('Database Error:', queryError);

      response.status(500).json({
        succeeded: false,
        data: null,
        message: 'Erro ao processar a consulta no banco de dados.',
        error: {
          message: queryError.message,
          // code: queryError.driverError?.code,
          // detail: queryError.driverError?.detail,
        },
      });
    } else {
      console.error('Unhandled Exception:', exception);

      response.status(500).json({
        succeeded: false,
        data: null,
        message: 'Erro desconhecido. Contate o administrador.',
        error: exception.message || exception,
      });
    }
  }
}

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { DomainError } from '../errors/domain-error';
import { FastifyReply } from 'fastify';
import { SERVICE_NAME } from '../envs';

@Catch(HttpException, DomainError)
export class DefaultExceptionsFilter implements ExceptionFilter {
  parseMessages(messages: string[]) {
    return messages.reduce((acc: any, cur: string) => {
      const key = cur.split(' ').shift();
      const hasKey = Object.keys(acc).includes(key);

      if (!hasKey) {
        acc[key] = [];
      }

      acc[key].push(cur.replace(key, '').slice(1));
      return acc;
    }, {});
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse();

    const { status, errors } = (() => {
      if (exception instanceof DomainError) {
        return {
          status: exception.httpStatus,
          errors: [
            {
              code: exception.errorCode,
              detail: exception.message,
            },
          ],
        };
      }

      if (exception instanceof NotFoundException) {
        return {
          status: HttpStatus.NOT_FOUND,
          errors: [
            {
              code: `${SERVICE_NAME}/resource-not-found`,
              detail: exception.message,
            },
          ],
        };
      }

      const tokenizeString = (s: string) =>
        s.toLowerCase().split(' ').join('-');

      if (exception instanceof BadRequestException) {
        if (
          typeof exception.getResponse() === 'object' &&
          'message' in (exception.getResponse() as Record<any, any>)
        ) {
          const { message } = exception.getResponse() as {
            message: unknown;
          };

          const isArrayMessage = (value: unknown): value is string[] =>
            Array.isArray(value) && typeof value[0] === 'string';
          return {
            status: HttpStatus.BAD_REQUEST,
            errors: (isArrayMessage(message) ? message : [String(message)]).map(
              (error) => ({
                code: `${SERVICE_NAME}/${tokenizeString(error)}`,
                detail: error,
              }),
            ),
          };
        }
      }

      if (exception instanceof HttpException) {
        return {
          status: exception.getStatus(),
          errors: [
            {
              code: `${SERVICE_NAME}/${tokenizeString(exception.name)}`,
              detail: exception.message,
            },
          ],
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            code: `${SERVICE_NAME}/internal-server-error`,
            detail: 'Internal server error',
          },
        ],
      };
    })();

    response.status(status).send({
      errors,
    });
  }
}

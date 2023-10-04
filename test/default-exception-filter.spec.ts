import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SERVICE_NAME } from '../src/commons/envs';
import { DomainError } from '../src/commons/errors/domain-error';
import { DefaultExceptionsFilter } from '../src/commons/filters/default-exception.filter';

const createMockResponse = () => {
  const statusFn = jest.fn();
  const sendFn = jest.fn().mockReturnThis();
  return {
    status: statusFn.mockImplementation(() => ({
      send: sendFn,
    })),
    send: sendFn,
    json: sendFn,
  };
};

describe('DefaultExceptionsFilter', () => {
  let filter: DefaultExceptionsFilter;
  const response = createMockResponse();

  const createHttpExceptionStatus = (status: number) =>
    new HttpException('message', status);

  beforeEach(() => {
    filter = new DefaultExceptionsFilter();
  });

  it('should catch not found exception', () => {
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(response),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new NotFoundException(), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.send).toHaveBeenCalledWith({
      errors: [
        {
          code: `${SERVICE_NAME}/resource-not-found`,
          detail: 'Not Found',
        },
      ],
    });
  });

  it('should catch Domain Error exception', () => {
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(response),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(
      new DomainError(
        `Carrier not found`,
        `${SERVICE_NAME}/carrier-not-found`,
        HttpStatus.BAD_REQUEST,
      ),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.send).toHaveBeenCalledWith({
      errors: [
        {
          code: `${SERVICE_NAME}/carrier-not-found`,
          detail: 'Carrier not found',
        },
      ],
    });
  });

  it('should catch http exception', () => {
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(response),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(createHttpExceptionStatus(401), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });
});

export class DomainError extends Error {
  public readonly httpStatus: number;

  public readonly errorCode: string;

  constructor(message: string, errorCode: string, httpStatus: number) {
    super(message);
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
  }
}

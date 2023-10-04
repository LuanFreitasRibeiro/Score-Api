export default interface UseCase<IRequest, IResponse> {
  execute(input?: IRequest): Promise<IResponse> | IResponse;
}

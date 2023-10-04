/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import CreateUserUseCase from '../../../src/application/usecases/user/CreateUser.usecase';
import UserController from '../../../src/presentation/controllers/User.controller';
import GetUserByEmailUseCase from 'src/application/usecases/user/GetUserByEmail.usecase';
import GetUserByIdUseCase from 'src/application/usecases/user/GetUserById.usecase';

describe.skip('Integration Test - User Controller', () => {
  let controller: UserController;
  let createUseCase: CreateUserUseCase;
  let getUserByEmailUseCase: GetUserByEmailUseCase;
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        GetUserByEmailUseCase,
        GetUserByIdUseCase,
        {
          provide: 'UserRepository',
          useValue: {},
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    createUseCase = await moduleRef.resolve<CreateUserUseCase>(UserController);
    getUserByEmailUseCase =
      await moduleRef.resolve<GetUserByEmailUseCase>(UserController);
    getUserByIdUseCase =
      await moduleRef.resolve<GetUserByIdUseCase>(UserController);
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
    expect(createUseCase).toBeDefined();
    expect(getUserByEmailUseCase).toBeDefined();
    expect(getUserByIdUseCase).toBeDefined();
  });

  it('Should create a User', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      document: '22668510040',
      password: '123456',
    };
    const spyCreateUseCase = jest
      .spyOn(createUseCase, 'execute')
      .mockResolvedValue(
        Promise.resolve({ userId: '49dc5ec7-1672-471a-ae5a-0e2ad86fd6d4' }),
      );

    const output = await controller.create(input);
    expect(output).toBeUndefined();
    expect(spyCreateUseCase).toBeCalled();
  });
});

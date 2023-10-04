/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import UserRepository from 'src/application/repository/UserRepository.interface';
import CreateUserUseCase from 'src/application/usecases/user/CreateUser.usecase';
import GetUserByEmailUseCase from 'src/application/usecases/user/GetUserByEmail.usecase';
import User from 'src/domain/user/User';
import MongooseUserRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/User.repository';
import MongooseUserEntity from 'src/infrastructure/database/repositories/mongoose/schemas/User.schema';

describe('Unit Test - Get User By Email Use Case', () => {
  let useCase: GetUserByEmailUseCase;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserByEmailUseCase,
        {
          provide: 'UserRepository',
          useClass: MongooseUserRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseUserEntity.name),
          useValue: {},
        },
      ],
    }).compile();

    useCase = moduleRef.get(GetUserByEmailUseCase);
    userRepository = moduleRef.get('UserRepository');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('Should get a user by email', async () => {
    userRepository = {
      async save(user: any): Promise<void> {},
      async getOne(email: any): Promise<any> {
        return User.create(
          'john.doe@gmail.com',
          'John Doe',
          '123456',
          '22668510040',
        );
      },
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };

    const input = {
      email: 'john.doe@gmail.com',
    };
    const getUseCase = new GetUserByEmailUseCase(userRepository);
    const output = await getUseCase.execute(input);
    expect(output.userId).toBeDefined();
  });

  it('Should throw an error: User not found', async () => {
    userRepository = {
      async save(user: User): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };

    const input = {
      email: 'John Doe',
    };
    const getUseCase = new GetUserByEmailUseCase(userRepository);
    await expect(() => getUseCase.execute(input)).rejects.toThrow(
      new Error('User not found'),
    );
  });
});

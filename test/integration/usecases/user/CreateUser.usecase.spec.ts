/* eslint-disable @typescript-eslint/no-unused-vars */
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import CreateUserUseCase from 'src/application/usecases/user/CreateUser.usecase';
import { Role } from 'src/commons/enums/Role.enum';
import User from 'src/domain/user/User';
import MongooseUserRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/User.repository';
import MongooseUserEntity from 'src/infrastructure/database/repositories/mongoose/schemas/User.schema';
import ScoreProducerRabbitMQ from 'src/infrastructure/rabbitmq/score/Score.producer';


describe('Unit Test - Create User Use Case', () => {
  let useCase: CreateUserUseCase;
  let userRepository: UserRepository;
  let scoreProducer: ScoreProducer;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'ScoreProducer',
          useClass: ScoreProducerRabbitMQ,
        },
        {
          provide: 'UserRepository',
          useClass: MongooseUserRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseUserEntity.name),
          useValue: {},
        },
        {
          provide: AmqpConnection,
          useValue: {},
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateUserUseCase);
    userRepository = moduleRef.get('UserRepository');
    scoreProducer = moduleRef.get('ScoreProducer');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(scoreProducer).toBeDefined();
  });

  it('Should create a User', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      document: '22668510040',
      password: 'John@1234',
      role: Role.Customer,
    };
    userRepository = {
      async save(user: User): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };
    scoreProducer = {
      async createScorePublish(userId: string): Promise<void> {},
      async updateScorePublish(userId: string): Promise<void> {},
    };
    const createUseCase = new CreateUserUseCase(userRepository, scoreProducer);
    const output = await createUseCase.execute(input);
    expect(output.userId).toBeDefined();
  });

  it('Should not create a User with invalid email', async () => {
    userRepository = {
      async save(user: User): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };
    const input = {
      name: 'John Doe',
      email: 'john.doe@gmail',
      document: '22668510040',
      password: '123456',
      role: Role.Customer,
    };
    const createUseCase = new CreateUserUseCase(userRepository, scoreProducer);
    await expect(() => createUseCase.execute(input)).rejects.toThrow(
      new Error('Invalid email'),
    );
  });
});

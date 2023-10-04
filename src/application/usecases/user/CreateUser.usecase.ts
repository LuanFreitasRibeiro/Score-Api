import { Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import User from '../../../domain/user/User';
import RabbitMQAdapter from 'src/infrastructure/queue/RabbitMQAdapter';
import { ClientProxy } from '@nestjs/microservices';

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
};
type Output = {
  userId: string;
};
export default class CreateUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
    @Inject('Store')
    private client: ClientProxy,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = User.create(
      input.email,
      input.name,
      input.password,
      input.document,
    );
    await this.userRepository.save(user);

    try {
      await this.client.emit('create-store', { data: { userId: user.userId } });
    } catch (error) {
      throw error;
    }

    // await this.rabbitMQService.send('create-score', { userId: user.userId });
    // const queuea = new RabbitMQAdapter();
    // await queuea.connect();
    // queuea.publish('create-score', JSON.stringify({ userId: user.userId }));
    // // this.queue.connect();
    // // this.queue.publish('create-score', { userId: user.userId });
    return {
      userId: user.userId,
    };
  }
}

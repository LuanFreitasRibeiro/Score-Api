import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Store',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'create-score',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export default class RabbitMQProducerModule {}

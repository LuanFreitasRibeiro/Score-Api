import { SERVICE_NAME } from 'src/commons/envs';
import Queue from './Queue';
import { DomainError } from 'src/commons/errors/domain-error';
import { HttpStatus } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqp = require('amqplib');

export default class RabbitMQAdapter implements Queue {
  private connection: any;

  async connect(): Promise<void> {
    this.connection = await amqp.connect('amqp://localhost');
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async consume(queueName: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      try {
        await callback(input);
        channel.ack(msg);
      } catch (error: any) {
        throw new DomainError(
          'Something happen',
          `${SERVICE_NAME}/score-not-found`,
          HttpStatus.NOT_FOUND,
        );
      }
    });
  }

  async publish(queueName: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  }
}

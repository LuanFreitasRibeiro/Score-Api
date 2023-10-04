import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import Queue from './Queue';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export default class QueueConsumer {
  @Inject('CreateScoreUseCase')
  createScore: CreateScoreUseCase;

  constructor(readonly queue: Queue) {}

  @MessagePattern('score')
  public async createStoreConsumer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    console.log('data', data);
    try {
      await this.createScore?.execute({ userId: data.userId, score: 0 });
      channel.ack(message);
    } catch (error) {
      throw new Error();
    }
  }
}

// constructor(readonly queue: Queue) {
//   queue.consume('create-score', async (input: any) => {
//     const output = await this.createScore?.execute({
//       userId: input.userId,
//       score: 0,
//     });
//     console.log(output);
//   });
// }

// const queue = require("./queue");
// queue.consume("fila1", message => {
//     //process the message
//     console.log("processing " + message.content.toString());
// })

import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  SWAGGER_TITLE,
  SWAGGER_DESCRIPTION,
  APPLICATION_VERSION,
  SWAGGER_SERVER,
  SWAGGER_DOCS,
  APPLICATION_PORT,
} from './commons/envs';
import { DefaultExceptionsFilter } from './commons/filters/default-exception.filter';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function main() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocumentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(APPLICATION_VERSION)
    .addServer(SWAGGER_SERVER)
    .build();
  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };
  app.useGlobalFilters(new DefaultExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder,
    swaggerDocumentOptions,
  );

  SwaggerModule.setup(SWAGGER_DOCS, app, swaggerDocument);
  const port = APPLICATION_PORT;
  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost'],
      queue: 'create-score',
      prefetchCount: 1,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  // const queue = new RabbitMQAdapter();
  // await queue.connect();
  // new QueueConsumer(queue);
  await app.listen(port).then(() => console.log(`Running at port ${port}`));
}
main();

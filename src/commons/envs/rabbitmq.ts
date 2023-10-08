export const RABBITMQ_URI = String(process.env.RABBITMQ_URI);
export const RABBITMQ_PREFETCH = Number(process.env.RABBITMQ_PREFETCH);
export const RABBITMQ_CREATE_SCORE_EXCHANGE = String(
  process.env.RABBITMQ_CREATE_SCORE_EXCHANGE,
);
export const RABBITMQ_CREATE_SCORE_QUEUE = String(
  process.env.RABBITMQ_CREATE_SCORE_QUEUE,
);
export const RABBITMQ_UPDATE_SCORE_EXCHANGE = String(
  process.env.RABBITMQ_UPDATE_SCORE_EXCHANGE,
);
export const RABBITMQ_UPDATE_SCORE_QUEUE = String(
  process.env.RABBITMQ_UPDATE_SCORE_QUEUE,
);

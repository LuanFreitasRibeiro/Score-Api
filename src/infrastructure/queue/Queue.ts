export default interface Queue {
  connect(): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  consume(queueName: string, callback: Function): Promise<void>;
  publish(queueName: string, data: any): Promise<void>;
}

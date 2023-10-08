export default interface ScoreProducer {
  createScorePublish(userId: string): Promise<void>;
  updateScorePublish(userId: string): Promise<void>;
}

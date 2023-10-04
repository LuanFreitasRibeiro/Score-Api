// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export default class UUIDGenerator {
  static create() {
    return crypto.randomUUID();
  }
}

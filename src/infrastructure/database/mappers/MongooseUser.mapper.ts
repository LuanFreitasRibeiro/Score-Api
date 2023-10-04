import User from 'src/domain/user/User';
import MongooseUserEntity from '../repositories/mongoose/schemas/User.schema';

export default class MongooseUserMapper {
  static toEntity(data: MongooseUserEntity): User {
    return new User(
      data.userId,
      data.name,
      data.email as any,
      data.password as any,
      data.document as any,
      data.createdAt,
      data.updatedAt,
    );
  }
}

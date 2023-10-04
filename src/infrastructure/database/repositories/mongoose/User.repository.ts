import { InjectModel } from '@nestjs/mongoose';
import MongooseUserEntity, {
  MongooseUserDocument,
} from './schemas/User.schema';
import { Model, QueryOptions } from 'mongoose';
import User from '../../../../../src/domain/user/User';
import UserRepository from 'src/application/repository/UserRepository.interface';
import MongooseUserMapper from '../../mappers/MongooseUser.mapper';

export default class MongooseUserRepositoryDatabase implements UserRepository {
  constructor(
    @InjectModel(MongooseUserEntity.name)
    public UserModel: Model<MongooseUserDocument>,
  ) {}
  async save(user: User): Promise<void> {
    await this.UserModel.create({
      ...user,
      email: user.email.value,
      password: user.password.value,
      document: user.document.value,
    });
  }
  async update(id: string, user: User): Promise<void> {
    await this.UserModel.findOneAndUpdate({ userId: id }, user, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.UserModel.findOneAndRemove({ userId: id });
  }
  async getOne(
    filter: Record<string, any>,
    options?: QueryOptions,
  ): Promise<User> {
    const user = await this.UserModel.findOne(filter, {}, options);
    return user == null ? null : MongooseUserMapper.toEntity(user);
  }
}

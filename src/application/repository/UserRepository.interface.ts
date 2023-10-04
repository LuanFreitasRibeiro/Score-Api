import User from 'src/domain/user/User';

export default interface UserRepository {
  save(user: User): Promise<void>;
  getOne(filter: Record<string, any>, options?: any): Promise<User | null>;
  update(
    id: string,
    user: Omit<User, 'userId' | 'toJSON' | 'createdAt'>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
}

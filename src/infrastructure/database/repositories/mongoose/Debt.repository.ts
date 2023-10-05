import DebtRepository, {
  DebtSearchParams,
} from 'src/application/repository/DebtRepository.interface';
import MongooseDebtEntity, {
  MongooseDebtDocument,
} from './schemas/Debt.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import Debt from 'src/domain/debt/Debt';
import MongooseDebtMapper from '../../mappers/MongooseDebt.mapper';

export default class MongooseDebtRepositoryDatabase implements DebtRepository {
  constructor(
    @InjectModel(MongooseDebtEntity.name)
    public debtModel: Model<MongooseDebtDocument>,
  ) {}

  async save(debt: Debt) {
    await this.debtModel.create(debt);
  }

  async getById(id: string): Promise<Debt> {
    const debt = await this.debtModel.findOne({ debtId: id });
    return debt == null ? null : MongooseDebtMapper.toEntity(debt);
  }

  async update(id: string, debt: Debt) {
    await this.debtModel.findOneAndUpdate({ debtId: id }, debt, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.debtModel.findOneAndDelete({ debtId: id });
  }

  async list(params: DebtSearchParams): Promise<[Debt[], number]> {
    const filter: Record<string, any> = {};

    if (params?.type) {
      filter.$or = [
        {
          type: {
            $regex: `${params?.type}.*`,
            $options: 'i',
          },
        },
      ];
    }

    const sortBy = {
      [params.orderBy]: params.order === 'asc' ? 1 : -1,
    };

    const count = await this.debtModel.countDocuments(filter);
    const result = await this.debtModel.find(
      filter,
      {},
      {
        limit: params.pageSize,
        skip: params.pageSize * (params.pageNumber - 1),
        sort: sortBy,
      },
    );

    return [result.map(MongooseDebtMapper.toEntity), count];
  }

  async get(
    filter: Record<string, any>,
    options?: QueryOptions,
  ): Promise<Debt[]> {
    const debt = await this.debtModel.find(filter, {}, options);
    return debt == null ? null : debt.map(MongooseDebtMapper.toEntity);
  }
}

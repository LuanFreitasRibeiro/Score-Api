import Debt from 'src/domain/debt/Debt';
import MongooseDebtEntity from '../repositories/mongoose/schemas/Debt.schema';

export default class MongooseDebtMapper {
  static toEntity(data: MongooseDebtEntity): Debt {
    return new Debt(
      data.debtId,
      data.userId,
      data.amount,
      data.type,
      data.createdAt,
      data.updatedAt,
    );
  }
}

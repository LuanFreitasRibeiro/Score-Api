import Debt from 'src/domain/debt/Debt';

export type DebtSearchParams = {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  order: string;
  type?: string;
};

export default interface DebtRepository {
  save(debt: Debt): Promise<void>;
  getById(id: string): Promise<Debt>;
  get(filter: Record<string, any>, options?: any): Promise<Debt[]>;
  update(
    id: string,
    debt: Omit<Debt, 'debtId' | 'userId' | 'toJSON' | 'createdAt'>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
  list(params: DebtSearchParams): Promise<[Debt[], number]>;
}

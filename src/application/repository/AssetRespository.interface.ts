import Asset from '../../domain/asset/Asset';

export type AssetSearchParams = {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  order: string;
  type?: string;
};

export default interface AssetRepository {
  save(asset: Asset): Promise<void>;
  getById(id: string): Promise<Asset>;
  get(filter: Record<string, any>, options?: any): Promise<Asset[]>;
  update(
    id: string,
    asset: Omit<Asset, 'assetId' | 'userId' | 'toJSON' | 'createdAt'>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
  list(params: AssetSearchParams): Promise<[Asset[], number]>;
}

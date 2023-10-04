import Asset from '../../src/domain/asset/Asset';

describe('Unit Test - Asset', () => {
  it('Should create a Asset', () => {
    const asset = Asset.create('', 'Imovel', 13000);
    expect(asset.assetId).toBeDefined();
    expect(asset.type).toBe('Imovel');
    expect(asset.amount).toBe(13000);
  });
});

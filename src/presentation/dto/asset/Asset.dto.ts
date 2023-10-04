import { ApiProperty } from '@nestjs/swagger';
import { classToClass, plainToClass } from 'class-transformer';
import Asset from 'src/domain/asset/Asset';

export class AssetDTO {
  @ApiProperty({
    description: 'Amount of the asset',
    type: Number,
    required: true,
    example: 15000,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of the asset',
    type: String,
    required: true,
    example: 'imóvel',
  })
  type: string;

  public static factory(asset: Asset) {
    const resultQueryDto = plainToClass(AssetDTO, asset.toJSON(), {
      ignoreDecorators: false,
    });

    return classToClass(resultQueryDto, {
      excludePrefixes: ['_', '__'],
    });
  }
}

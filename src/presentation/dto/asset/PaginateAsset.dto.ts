import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { MetaPagination } from 'src/commons/dtos/paginated-results.dto';
import { AssetDTO } from './Asset.dto';

export default class PaginateAssetDTO {
  @ApiProperty({
    description: 'List of Assets',
    type: AssetDTO,
    isArray: true,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AssetDTO)
  data: AssetDTO[];

  @ApiProperty({
    description: 'Meta information of request',
    type: MetaPagination,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MetaPagination)
  meta: MetaPagination;

  constructor(
    data: AssetDTO[],
    totalElements: number,
    pageNumber: number,
    pageSize: number,
  ) {
    const totalPages = Math.ceil(totalElements / pageSize);

    this.data = data;
    this.meta = new MetaPagination({
      totalPages,
      totalElements,
      pageNumber,
      pageSize,
    });
  }
}

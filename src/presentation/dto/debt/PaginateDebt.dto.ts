import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { MetaPagination } from 'src/commons/dtos/paginated-results.dto';
import { DebtDTO } from './Debt.dto';

export default class PaginateDebtDTO {
  @ApiProperty({
    description: 'List of Debts',
    type: DebtDTO,
    isArray: true,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DebtDTO)
  data: DebtDTO[];

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
    data: DebtDTO[],
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

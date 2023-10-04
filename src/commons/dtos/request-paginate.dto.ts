import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum OrderEnum {
  asc = 'asc',
  desc = 'desc',
}
export class RequestPaginateDTO {
  @ApiPropertyOptional({ type: 'integer', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageNumber?: number;

  @ApiPropertyOptional({ type: 'integer', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  orderBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: OrderEnum, default: OrderEnum.desc })
  @IsString()
  @IsOptional()
  order?: OrderEnum;
}

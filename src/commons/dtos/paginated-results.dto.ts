import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

interface IPagination {
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

export class Pagination {
  @ApiProperty()
  @IsNumber()
  totalPages: number;

  @ApiProperty()
  @IsNumber()
  totalElements: number;

  @ApiProperty()
  @IsNumber()
  pageNumber: number;

  @ApiProperty()
  @IsNumber()
  pageSize: number;

  constructor({
    totalPages,
    totalElements,
    pageNumber,
    pageSize,
  }: IPagination) {
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}

export class MetaPagination {
  @ApiProperty({
    description: 'Meta information of pagination',
    type: Pagination,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Pagination)
  pagination: Pagination;

  constructor(pagination: IPagination) {
    this.pagination = new Pagination(pagination);
  }
}

export abstract class PaginatedResults<T> {
  data: T[];

  @ApiProperty({ type: MetaPagination })
  meta: MetaPagination;

  constructor(data: T[], totalItems: number, page: number, pageSize: number) {
    this.data = data;
    this.meta = this.createMetadata(totalItems, pageSize, page);
  }

  createMetadata(totalItems: number, pageSize: number, page: number) {
    return {
      pagination: {
        totalPages: Math.ceil(totalItems / pageSize),
        totalElements: totalItems,
        pageNumber: page,
        pageSize: pageSize,
      },
    };
  }
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RequestPaginateDTO } from 'src/commons/dtos/request-paginate.dto';

export default class InputListDebtDTO extends RequestPaginateDTO {
  @ApiPropertyOptional({
    description: 'type of Debt',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  type?: string;
}

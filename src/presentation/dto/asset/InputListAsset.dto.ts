import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RequestPaginateDTO } from 'src/commons/dtos/request-paginate.dto';

export default class InputListAssetDTO extends RequestPaginateDTO {
  @ApiPropertyOptional({
    description: 'type of asset',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  type?: string;
}

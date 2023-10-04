import { ApiProperty } from '@nestjs/swagger';
import { AssetDTO } from './Asset.dto';

export default class CreateAssetDTO extends AssetDTO {
  @ApiProperty({
    description: 'User ID of the asset owner',
    type: String,
    required: true,
    example: '1222cf11-6562-4e62-9de3-428aa6fd484a',
  })
  userId: string;
}

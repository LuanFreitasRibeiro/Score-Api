import { ApiProperty } from '@nestjs/swagger';
import { DebtDTO } from './Debt.dto';

export default class CreateDebtDTO extends DebtDTO {
  @ApiProperty({
    description: 'User ID of the Debt owner',
    type: String,
    required: true,
    example: '1222cf11-6562-4e62-9de3-428aa6fd484a',
  })
  userId: string;
}

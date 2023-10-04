import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, classToClass } from 'class-transformer';
import Debt from 'src/domain/debt/Debt';

export class DebtDTO {
  @ApiProperty({
    description: 'Amount of the Debt',
    type: Number,
    required: true,
    example: 15000,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of the Debt',
    type: String,
    required: true,
    example: 'imóvel',
  })
  type: string;

  public static factory(debt: Debt) {
    const resultQueryDto = plainToClass(DebtDTO, debt.toJSON(), {
      ignoreDecorators: false,
    });

    return classToClass(resultQueryDto, {
      excludePrefixes: ['_', '__'],
    });
  }
}

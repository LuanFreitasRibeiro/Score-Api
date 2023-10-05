import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({
    description: 'Email',
    type: String,
    required: true,
    example: 'john.doe@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    example: 'John@Doe1234',
  })
  password: string;
}

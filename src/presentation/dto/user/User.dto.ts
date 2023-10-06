import { ApiProperty } from '@nestjs/swagger';
import { classToClass, plainToClass } from 'class-transformer';
import { Matches } from 'class-validator';
import { Role } from 'src/commons/enums/Role.enum';
import { RegExHelper } from 'src/commons/helpers/regex.helper';
import User from 'src/domain/user/User';

export default class UserDTO {
  @ApiProperty({
    description: 'Name',
    type: String,
    required: true,
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'E-mail',
    type: String,
    required: true,
    example: 'john.doe@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    example: '123456',
  })
  @Matches(RegExHelper.password, {
    message:
      'The password must contain uppercase letters, lowercase letters, numbers and special characters',
  })
  password: string;

  @ApiProperty({
    description: 'CPF',
    type: String,
    required: true,
    example: '22668510040',
  })
  document: string;

  @ApiProperty({
    description: 'Role',
    type: String,
    required: true,
    example: 'customer',
  })
  role: Role;

  public static factory(user: User) {
    const resultQueryDto = plainToClass(UserDTO, user.toJSON(), {
      ignoreDecorators: false,
    });

    return classToClass(resultQueryDto, {
      excludePrefixes: ['_', '__'],
    });
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import UserDTO from '../dto/user/User.dto';
import CreateUserUseCase from 'src/application/usecases/user/CreateUser.usecase';
import GetUserByEmailUseCase from 'src/application/usecases/user/GetUserByEmail.usecase';
import GetUserByIdUseCase from 'src/application/usecases/user/GetUserById.usecase';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export default class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  async create(@Body() input: UserDTO) {
    try {
      const output = await this.createUserUseCase.execute(input);
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get('/email/:email')
  @ApiOperation({ summary: 'Get a user by email' })
  @UseGuards(AuthGuard('jwt'))
  async getByEmail(@Param('email') email: string) {
    try {
      const output = await this.getUserByEmailUseCase.execute({ email });
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get a user by id' })
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    try {
      const output = await this.getUserByIdUseCase.execute({ userId: id });
      return output;
    } catch (error) {
      throw error;
    }
  }
}

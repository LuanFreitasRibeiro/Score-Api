import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DebtDTO } from '../dto/debt/Debt.dto';
import InputListDebtDTO from '../dto/debt/InputListDebt.dto';
import PaginateDebtDTO from '../dto/debt/PaginateDebt.dto';
import CreateDebtUseCase from 'src/application/usecases/debt/CreateDebt.usecase';
import GetByIdUseCase from 'src/application/usecases/debt/GetDebtById.usecase';
import UpdateDebtUseCase from 'src/application/usecases/debt/UpdateDebt.usecase';
import DeleteDebtUseCase from 'src/application/usecases/debt/DeleteDebt.usercase';
import GetDebtsUseCase from 'src/application/usecases/debt/GetDebts.usecase';
import CreateDebtDTO from '../dto/debt/CreateDebt.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('debts')
@ApiTags('Debt')
@UseGuards(AuthGuard('jwt'))
export default class DebtController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly getDebtByIdUseCase: GetByIdUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
    private readonly deleteDebtUseCase: DeleteDebtUseCase,
    private readonly getDebtsUseCase: GetDebtsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a Debt' })
  @ApiResponse({ status: 201 })
  async create(@Body() input: CreateDebtDTO) {
    try {
      const output = await this.createDebtUseCase.execute(input);
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Debt by id' })
  @ApiResponse({ status: 200, type: DebtDTO })
  async getById(@Param('id') id: string) {
    try {
      const output = await this.getDebtByIdUseCase.execute({ debtId: id });
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get a Debt by params' })
  @ApiResponse({ status: 200, type: DebtDTO })
  async get(
    @Query(new ValidationPipe({ transform: true })) params: InputListDebtDTO,
  ) {
    try {
      const [result, count] = await this.getDebtsUseCase.execute(params);

      return new PaginateDebtDTO(
        result.map(DebtDTO.factory),
        count,
        params.pageNumber ? params.pageNumber : 1,
        params.pageSize ? params.pageSize : 20,
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Debt by id' })
  @ApiResponse({ status: 200, type: DebtDTO })
  async update(@Param('id') id: string, @Body() input: DebtDTO) {
    try {
      const output = await this.updateDebtUseCase.execute({
        debtId: id,
        ...input,
      });
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Debt by id' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    try {
      const output = await this.deleteDebtUseCase.execute({ debtId: id });
      return output;
    } catch (error) {
      throw error;
    }
  }
}

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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateAssetUseCase from 'src/application/usecases/asset/CreateAsset.usecase';
import { AssetDTO } from '../dto/asset/Asset.dto';
import GetByIdUseCase from 'src/application/usecases/asset/GetAssetById.usecase';
import UpdateAssetUseCase from 'src/application/usecases/asset/UpdateAsset.usecase';
import DeleteAssetUseCase from 'src/application/usecases/asset/DeleteAsset.usercase';
import InputListAssetDTO from '../dto/asset/InputListAsset.dto';
import GetAssetsUseCase from 'src/application/usecases/asset/GetAssets.usecase';
import PaginateAssetDTO from '../dto/asset/PaginateAsset.dto';
import CreateAssetDTO from '../dto/asset/CreateAsset.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
@ApiTags('Asset')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export default class AssetController {
  constructor(
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly getAssetByIdUseCase: GetByIdUseCase,
    private readonly updateAssetUseCase: UpdateAssetUseCase,
    private readonly deleteAssetUseCase: DeleteAssetUseCase,
    private readonly getAssetsUseCase: GetAssetsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a asset' })
  @ApiResponse({ status: 201 })
  async create(@Body() input: CreateAssetDTO) {
    try {
      const output = await this.createAssetUseCase.execute(input);
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a asset by id' })
  @ApiResponse({ status: 200, type: AssetDTO })
  async getById(@Param('id') id: string) {
    try {
      const output = await this.getAssetByIdUseCase.execute({ assetId: id });
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get a asset by params' })
  @ApiResponse({ status: 200, type: AssetDTO })
  async get(
    @Query(new ValidationPipe({ transform: true })) params: InputListAssetDTO,
  ) {
    try {
      const [result, count] = await this.getAssetsUseCase.execute(params);

      return new PaginateAssetDTO(
        result.map(AssetDTO.factory),
        count,
        params.pageNumber ? params.pageNumber : 1,
        params.pageSize ? params.pageSize : 20,
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a asset by id' })
  @ApiResponse({ status: 200, type: AssetDTO })
  async update(@Param('id') id: string, @Body() input: AssetDTO) {
    try {
      const output = await this.updateAssetUseCase.execute({
        assetId: id,
        ...input,
      });
      return output;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a asset by id' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    try {
      const output = await this.deleteAssetUseCase.execute({ assetId: id });
      return output;
    } catch (error) {
      throw error;
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleResponseDto } from './dto/role-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/empresas')
@ApiTags('Funções')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post(':empresaId/funcoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma função',
    description: 'Endpoint responsável por cadastrar uma função.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a função.',
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Função cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const role = await this.rolesService.create(
      companyId,
      createRoleDto,
      user.id,
    );

    return {
      succeeded: true,
      data: role,
      message: `Função cadastrada com sucesso, id: #${role.id}.`,
    };
  }

  @Get(':empresaId/funcoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as funções',
    description:
      'Endpoint responsável por listar todas as funções cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de funções em casos de sucesso.',
    type: [RoleResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.rolesService.findAll(companyId);
  }

  @Get('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar função',
    description: 'Endpoint responsável por listar dados de um função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da função em casos de sucesso.',
    type: RoleResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma função',
    description: 'Endpoint responsável por atualizar os dados de uma função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da função',
    type: UpdateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Função atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const role = await this.rolesService.update(id, updateRoleDto, user.id);

    return {
      succeeded: true,
      data: role,
      message: `Função id: #${role.id} atualizada com sucesso.`,
    };
  }

  @Delete('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma função',
    description: 'Endpoint responsável por excluir uma função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Função excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const role = await this.rolesService.remove(id, user.id);

    return {
      succeeded: true,
      data: role,
      message: `Função id: #${role.id} excluída com sucesso.`,
    };
  }
}

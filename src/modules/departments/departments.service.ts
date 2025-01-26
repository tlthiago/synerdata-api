import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createDepartmentDto: CreateDepartmentDto) {
    const company = await this.companiesService.findOne(companyId);

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      empresa: company,
    });

    await this.departmentRepository.save(department);

    return department.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    return this.departmentRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });
  }

  findOne(id: number) {
    return this.departmentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const result = await this.departmentRepository.update(id, {
      ...updateDepartmentDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O setor #${id} foi atualizado.`;
  }

  async remove(id: number) {
    const result = await this.departmentRepository.update(id, {
      status: 'E',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O setor #${id} foi excluído.`;
  }
}

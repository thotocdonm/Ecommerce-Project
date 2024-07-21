import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as bcrypt from 'bcryptjs';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: SoftDeleteModel<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    const isExisted = await this.userModel.findOne({ email: createUserDto.email });
    if (isExisted) {
      throw new BadRequestException('This email is already existed')
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt)
    const res = await this.userModel.create({ ...createUserDto, password: hashPassword })
    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs);

    delete filter.currentPage
    delete filter.pageSize

    const defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = await this.userModel.count({})
    const skip = (currentPage - 1) * defaultLimit
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: await this.userModel.find(filter)
        .skip(skip)
        .limit(defaultLimit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
    }
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto })
  }

  async remove(id: string) {
    return await this.userModel.softDelete({ _id: id })
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email: email })
  }
}

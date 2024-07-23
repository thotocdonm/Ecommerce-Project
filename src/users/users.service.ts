import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: SoftDeleteModel<UserDocument>) { }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExisted = await this.userModel.findOne({ email: createUserDto.email });
    if (isExisted) {
      throw new BadRequestException('This email is already existed')
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt)
    const res = await this.userModel.create
      ({
        ...createUserDto,
        password: hashPassword,
        role: "USER",
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async register(createUserDto: CreateUserDto) {
    const isExisted = await this.userModel.findOne({ email: createUserDto.email });
    if (isExisted) {
      throw new BadRequestException('This email is already existed')
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt)
    const res = await this.userModel.create
      ({
        ...createUserDto,
        password: hashPassword,
        role: "USER"
      })
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

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    let res = await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return await this.userModel.softDelete({ _id: id })
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email: email })
  }

  async updateUserToken(refreshToken: string, id: string) {
    return this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken })
  }

  async findOneByToken(refreshToken: String) {
    return await this.userModel.findOne({ refreshToken })
  }
}

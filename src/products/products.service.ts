import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from 'src/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: SoftDeleteModel<ProductDocument>) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const res = await this.productModel.create(
      {
        ...createProductDto,
        sold: 0,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    const defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = await this.productModel.countDocuments(filter)
    const skip = (current - 1) * defaultLimit
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: await this.productModel.find(filter, '-refreshToken')
        .skip(skip)
        .limit(defaultLimit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
    }
  }

  async findOne(id: string, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    return await this.productModel.findOne({ _id: id }).populate(population)
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    return await this.productModel.updateOne({ _id: id },
      {
        ...updateProductDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    let res = this.productModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.productModel.softDelete({ _id: id })
  }
}

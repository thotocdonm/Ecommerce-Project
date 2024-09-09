import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscribers, SubscribersDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { OrderDocument } from 'src/orders/schemas/order.schema';
import aqp from 'api-query-params';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class SubscribersService {

  constructor(
    @InjectModel(Subscribers.name) private readonly subscribersModel: SoftDeleteModel<SubscribersDocument>,

  ) { }

  async create(createSubscriberDto: CreateSubscriberDto) {
    let res = await this.subscribersModel.create({ ...createSubscriberDto });
    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async findAllWithoutPaginate() {
    return await this.subscribersModel.find({})
  }

  async findAll(current: number, pageSize: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    const defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = await this.subscribersModel.count({})
    const skip = (current - 1) * defaultLimit
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: await this.subscribersModel.find(filter)
        .skip(skip)
        .limit(defaultLimit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriber`;
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    let res = await this.subscribersModel.updateOne({ _id: id },
      {
        $set: {
          ...updateSubscriberDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }

      }
    )
    return res
  }

  async remove(id: string, user: IUser) {
    let res = this.subscribersModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.subscribersModel.softDelete({ _id: id })
  }
}

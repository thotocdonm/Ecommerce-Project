import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, status } from './schemas/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import aqp from 'api-query-params';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: SoftDeleteModel<ProductDocument>
  ) { }
  async create(createOrderDto: CreateOrderDto, user: IUser) {
    console.log(createOrderDto);

    let res = await this.orderModel.create({
      ...createOrderDto,
      user: user._id,
      status: 'Waiting for payment'
    })
    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async finishOrder(orderId: string, user: IUser): Promise<any> {
    const order = await this.orderModel.findById(orderId).exec();
    if (order.status === "DONE") {
      throw new BadRequestException(`This order is already done`);
    }
    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    // Update the status to 'DONE'
    order.status = "DONE"
    order.updatedBy = {
      _id: user._id,
      email: user.email
    }
    await order.save();

    for (const product of order.detail) {
      await this.productModel.findByIdAndUpdate(product._id, {
        $inc: { sold: product.quantity, quantity: -product.quantity },
      });
    }

    return {
      _id: order._id,
      status: order.status,
      updatedAt: order.updatedAt
    };
  }

  async findAll(current: number, pageSize: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    const defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = await this.orderModel.count({})
    const skip = (current - 1) * defaultLimit
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: await this.orderModel.find(filter)
        .skip(skip)
        .limit(defaultLimit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

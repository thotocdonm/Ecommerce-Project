import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/interface/user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ResponseMessage('Create a new order')
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ResponseMessage('Get orders with paginate')
  findAll(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query() qs,
  ) {
    return this.ordersService.findAll(+current, +pageSize, qs);
  }

  @Post(':id')
  @ResponseMessage('Finish a order')
  finishOrder(@Param('id') id: string, @User() user: IUser) {
    return this.ordersService.finishOrder(id, user);
  }

  @Get('order-history')
  @ResponseMessage('Get user orders with paginate')
  getUserOrder(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query() qs,
    @User() user: IUser
  ) {
    return this.ordersService.getUserOrderWithPaginate(+current, +pageSize, qs, user._id);
  }

  @Get('total-price')
  @ResponseMessage('Get total price of all orders')
  async totalPrice() {
    return await this.ordersService.calculateTotalPrice();
  }

  @Get('total-orders')
  @ResponseMessage('Get total number of all orders')
  async totalOrders() {
    return await this.ordersService.totalOrders();
  }


}

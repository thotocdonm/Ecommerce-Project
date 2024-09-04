import { Body, Controller, Post, Req } from '@nestjs/common';
import { MomoService } from './momo.service';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) { }

  @Post('payment')
  @ResponseMessage('Create payment url')
  createPayment(@Body('amount') amount: number) {
    return this.momoService.createPaymentUrl(amount);
  }

  @Post('callback')
  @ResponseMessage('Payment Callback')
  returnCallback(@Req() request: Request) {
    return this.momoService.returnCallback(request);
  }

  @Post('transaction-status')
  @ResponseMessage('Check transaction status')
  transactionStatus(@Body('orderId') orderId: string) {
    return this.momoService.checkTrasactionStatus(orderId);
  }
}

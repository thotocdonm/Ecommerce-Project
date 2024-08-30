import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { VnpayService } from './vnpay.service';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Get('vnpay-create')
  @Redirect()
  createPayment(@Query('orderId') orderId: string, @Query('amount') amount: number) {
    const returnUrl = 'https://yourdomain.com/payment/vnpay-return';
    const paymentUrl = this.vnpayService.createPaymentUrl(orderId, amount, returnUrl);
    return { url: paymentUrl };
  }

  @Get('vnpay-return')
  handleVnpayReturn(@Query() query: Record<string, string>) {
    const isValid = this.vnpayService.verifyReturnUrl(query);

    if (isValid) {
      // Handle success scenario
      // Update order status, notify user, etc.
      return { message: 'Payment successful', data: query };
    } else {
      // Handle failure scenario
      return { message: 'Payment failed', data: query };
    }
  }
}

import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from 'src/interface/user.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService
  ) { }

  @Get()
  @ResponseMessage('Resend verify OTP')
  async handleResendOTP(@User() user: IUser) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 20 * 60 * 1000;
    return this.mailService.sendVerifyOTP(otp, expirationTime, user.email)
  }

  @Get('subscriber')
  @Public()
  @ResponseMessage('Send email to Subscribers')
  async handleSendEmailToSubscribers() {
    return this.mailService.sendEmailToSubscriber()
  }


}

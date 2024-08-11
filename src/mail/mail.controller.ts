import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @ResponseMessage('Test Email')
  async handleTestEmail() {
    await this.mailerService
      .sendMail({
        to: 'minhsondiabla@gmail.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Verify your email', // Subject line
        template: 'OTP',
        context: {
          otp: 123456
        } // HTML body content
      })
  }
}

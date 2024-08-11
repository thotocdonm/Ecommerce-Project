import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendVerifyOTP(otp: string, email: string) {
        return await this.mailerService
            .sendMail({
                to: email, // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'Verify your email', // Subject line
                template: 'OTP',
                context: {
                    otp: otp
                } // HTML body content
            })
    }

}

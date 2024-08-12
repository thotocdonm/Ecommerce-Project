import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) { }

    async sendVerifyOTP(otp: string, expirationTime: number, email: string) {
        const res = this.usersService.resendOTP(otp, expirationTime, email)


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

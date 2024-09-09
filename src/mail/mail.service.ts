import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private subscribersService: SubscribersService,
        private productsService: ProductsService
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

    async sendEmailToSubscriber() {
        const newProduct = await this.productsService.findAll(1, 5, `sort=-createdAt`);
        const subscribers = await this.subscribersService.findAllWithoutPaginate();
        console.log(newProduct)
        // for (const subs in subscribers) {
        //     const user = subscribers[subs]
        //     await this.mailerService
        //         .sendMail({
        //             to: user.email, // list of receivers
        //             from: 'noreply@nestjs.com', // sender address
        //             subject: 'Verify your email', // Subject line
        //             template: 'Subscriber',
        //             context: {
        //                 products: newProduct.result
        //             } // HTML body content
        //         })
        // }
        return await this.mailerService
            .sendMail({
                to: subscribers[0].email, // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'New product arrivals', // Subject line
                template: 'Subscriber',
                context: {
                    products: newProduct.result
                } // HTML body content
            })
    }

}

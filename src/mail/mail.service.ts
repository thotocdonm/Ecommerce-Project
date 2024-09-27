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

        const calculateAverageRating = (reviews) => {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return totalRating / reviews.length;
        };
        const data = newProduct.result.map((item, index) => {
            const itemObj = item.toObject();

            const avgRating = calculateAverageRating(itemObj.reviews);
            const firstImage = itemObj.colors[0].image[0];
            return {
                ...itemObj,
                avgRating: avgRating ? avgRating : 5,
                firstImage
            }
        })

        for (const subs in subscribers) {
            const user = subscribers[subs]
            await this.mailerService
                .sendMail({
                    to: user.email, // list of receivers
                    from: 'noreply@nestjs.com', // sender address
                    subject: 'New arrival products', // Subject line
                    template: 'Subscriber',
                    context: {
                        products: data,
                        userName: user.email
                    } // HTML body content
                })
        }
        return 'ok'
    }

}

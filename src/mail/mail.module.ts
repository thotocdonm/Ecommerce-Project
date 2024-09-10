import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersModule } from 'src/users/users.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { ProductsModule } from 'src/products/products.module';
import { ScheduleModule } from '@nestjs/schedule';
import { registerHandlebarsHelpers } from './handlebars.helper.function';


@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [
    ScheduleModule.forRoot(),
    SubscribersModule,
    ProductsModule,
    forwardRef(() => UsersModule),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('AUTH_APP_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,

          },
        },
      }),
      inject: [ConfigService],
    }),
  ]
})
export class MailModule {
  constructor() {
    // Register your custom helpers when the module initializes
    registerHandlebarsHelpers();
  }
}

import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribers, SubscribersSchema } from './schemas/subscriber.schema';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  imports: [MongooseModule.forFeature([{ name: Subscribers.name, schema: SubscribersSchema }])],
  exports: [SubscribersService]
})
export class SubscribersModule { }

import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { Review, ReviewSchema } from './schema/review.schema';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports:
    [
      MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
      MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])
    ]
})
export class ReviewsModule { }

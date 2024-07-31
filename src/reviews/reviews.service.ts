import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { IUser } from 'src/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: SoftDeleteModel<ReviewDocument>,
    @InjectModel(Product.name) private readonly productModel: SoftDeleteModel<ProductDocument>
  ) { }
  async create(createReviewDto: CreateReviewDto, user: IUser, productId: string) {
    const { rating } = createReviewDto;
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    let res = await this.reviewModel.create({
      ...createReviewDto,
      rating: rating,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })

    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { $push: { reviews: res._id } },
      { new: true, useFindAndModify: false }
    );

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }



    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: IUser) {
    let res = await this.reviewModel.updateOne({ _id: id },
      {
        ...updateReviewDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return res
  }

  async remove(id: string, user: IUser, productId: string) {
    const res1 = await this.productModel.findByIdAndUpdate(
      productId,
      { $pull: { reviews: id } },
      { new: true, useFindAndModify: false }
    );

    const res2 = await this.reviewModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    const res3 = await this.reviewModel.softDelete({ _id: id })
    return res3
  }
}

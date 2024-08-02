import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Header, Headers, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/interface/user.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @ResponseMessage('Create a new review')
  create(@Body() createReviewDto: CreateReviewDto, @User() user: IUser) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  @ResponseMessage('Get reviews with paginate')
  findAll(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query() qs,
  ) {
    return this.reviewsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Update a review')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @User() user: IUser) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a review')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.reviewsService.remove(id, user);
  }
}

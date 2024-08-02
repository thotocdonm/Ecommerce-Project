import { IsNotEmpty, Max, Min } from "class-validator"

export class CreateReviewDto {
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    rating: number


    @IsNotEmpty()
    product: string
}

import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class CreateOrderDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    phone: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DetailProduct)
    detail: DetailProduct[]

}

class DetailProduct {

    @IsNotEmpty()
    productName: string

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    _id: string


}

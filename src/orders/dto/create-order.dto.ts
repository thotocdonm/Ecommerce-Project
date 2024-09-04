import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"

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
    paymentMethod: string

    @IsOptional()
    momoOrderId: string

    @IsOptional()
    note: string

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

    @IsNotEmpty()
    size: string;

    @IsNotEmpty()
    color: string;


}

import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: string

    @IsNotEmpty()
    colors: string[]

    @IsNotEmpty()
    size: string[]

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    style: string
}

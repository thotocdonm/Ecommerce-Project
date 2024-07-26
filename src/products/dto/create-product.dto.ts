import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, ValidateNested, isArray, isNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Color)
    colors: Color[]

    @IsNotEmpty()
    size: string[]

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    style: string
}

export class Color {

    @IsNotEmpty()
    colorName: string

    @IsNotEmpty()
    colorCode: string

    @IsNotEmpty()
    @IsArray()
    image: string[]


}

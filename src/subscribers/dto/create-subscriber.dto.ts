import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

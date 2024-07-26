import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop({ type: Object })
    ratings: {
        "id": string,
        "rating": number,
        "review": string,
        "createdAt": Date,
        "user": {
            _id: string,
            email: string
        }
    }[]

    @Prop({ type: Object })
    colors: {
        "colorName": string
        "colorCode": string,
        "image": string[]
    }

    @Prop()
    size: string[]

    @Prop()
    quantity: number

    @Prop()
    sold: number

    @Prop()
    type: string

    @Prop()
    style: string

    @Prop()
    gender: string

    @Prop()
    brand: string

    @Prop()
    averageRating: number

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    deletedAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: string,
        email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: string,
        email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: string,
        email: string
    }
}

export const ProductSchema = SchemaFactory.createForClass(Product);

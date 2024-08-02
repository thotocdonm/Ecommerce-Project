import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
    @Prop()
    rating: number

    @Prop()
    content: string

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
    product: Types.ObjectId;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    deletedAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: string,
        email: string,
        name: string
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

export const ReviewSchema = SchemaFactory.createForClass(Review);

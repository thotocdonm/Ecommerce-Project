import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;


@Schema()
class OrderProduct {

    @Prop()
    productName: string;

    @Prop()
    quantity: number;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
    product: Types.ObjectId;
}

const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: Types.ObjectId

    @Prop()
    name: string

    @Prop()
    address: string

    @Prop()
    phone: string

    @Prop()
    price: number

    @Prop({ type: Object })
    detail: OrderProduct[];

    @Prop()
    createdAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: string,
        email: string
    }


}

export const OrderSchema = SchemaFactory.createForClass(Order);

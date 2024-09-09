import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type SubscribersDocument = HydratedDocument<Subscribers>;

@Schema({ timestamps: true })
export class Subscribers {
    @Prop()
    email: string

    @Prop()
    createdAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: string,
        email: string
    }

    @Prop()
    updatedAt: Date

    @Prop({ type: Object })
    updatedBy: {
        _id: string,
        email: string
    }

    @Prop()
    deletedAt: Date

    @Prop({ type: Object })
    deletedBy: {
        _id: string,
        email: string
    }


}

export const SubscribersSchema = SchemaFactory.createForClass(Subscribers);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string

    @Prop()
    password: string

    @Prop()
    email: string

    @Prop()
    address: string

    @Prop()
    role: string

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

export const UserSchema = SchemaFactory.createForClass(User);

import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for User document
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the mongoose schema
const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});

// Create and export the model
export const User = mongoose.model<IUser>('User', UserSchema); 
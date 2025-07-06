import { User, IUser } from '../models/User';

export class UserRepository {
    async findAll(): Promise<IUser[]> {
        return User.find();
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
} 
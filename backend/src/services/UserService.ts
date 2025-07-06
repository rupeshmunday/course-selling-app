import { IUser } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: string): Promise<IUser | null> {
        return this.userRepository.findById(id);
    }

    async createUser(userData: {
        username: string;
        email: string;
        password: string;
    }): Promise<IUser> {
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        return this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        // If password is being updated, hash it
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        return this.userRepository.update(id, userData);
    }

    async deleteUser(id: string): Promise<IUser | null> {
        return this.userRepository.delete(id);
    }

    async validatePassword(user: IUser, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
} 
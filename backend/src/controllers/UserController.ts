import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Fetching all users',req.query);
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    };

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, email, password } = req.body;
            const user = await this.userService.createUser({ username, email, password });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.deleteUser(req.params.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    };
} 
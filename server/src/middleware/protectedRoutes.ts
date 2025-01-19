import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User';
export const protectedRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['token'];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = jwt.verify(token , JSON.stringify(process.env.JWT_SECRET)) as { id: string };
        if (!user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const foundUser = User.findById(user.id);
        if (!foundUser) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.locals.user = foundUser;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

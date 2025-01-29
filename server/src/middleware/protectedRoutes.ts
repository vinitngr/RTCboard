import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User';
export const protectedRoutes = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.cookie || req.headers['authorization']?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized, token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        
        if (!decoded || !decoded.userId) {
          return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        const foundUser = await User.findById(decoded.userId).select('-password'); 
        if (!foundUser) {
          return res.status(401).json({ message: 'User not found' });
        }
        res.locals.user = foundUser;
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();
export const protectedRoutes = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized, token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        if (!decoded?.id) {
          return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        const foundUser = await User.findById(decoded.id); // Await the result from the DB
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

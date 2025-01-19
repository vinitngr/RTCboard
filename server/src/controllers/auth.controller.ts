import { Request, Response } from 'express';
import path from 'path';
export const login = async (req: Request, res: Response) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public') });
};

export const register = async (req: Request, res: Response) => {
    res.send('Register route');
};

export const logout = async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../../public/logout.html');
    res.sendFile(filePath);
};

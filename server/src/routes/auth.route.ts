import express from 'express';
import { register , login , logout, checkAuth} from '../controllers/auth.controller';
import { protectedRoutes } from '../middleware/protectedRoutes';

const router = express.Router();

router.post('/login' , login )
router.post('/register' , register )
router.post('/logout' , logout )
router.get('/check-auth' , protectedRoutes , checkAuth)

export default router;
import { Router } from 'express';
import UserRouter from './User.js';
import TransferRouter from './Transfer.js';

const router = Router();

router.use('/user', UserRouter);
router.use('/transfer', TransferRouter);

export default router;

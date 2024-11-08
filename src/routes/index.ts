// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './users/user.routes.js';
import bookRoutes from './books/book.routes.js';
import reservationRoutes from './reservations/reservation.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/reservations', reservationRoutes);

export default router;
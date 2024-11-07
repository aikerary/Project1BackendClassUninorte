import { Router } from 'express';
import { createReservation, getReservations } from '../../controllers/reservations/reservation.controller';
// ...existing code...
const router = Router();

router.post('/', createReservation); // Create reservation (Requires authentication)
router.get('/', getReservations); // Get reservations (Requires authentication)

export default router;

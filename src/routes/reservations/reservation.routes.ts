// src/routes/reservations/reservation.routes.ts
import { Router } from 'express';
import { ReservationController } from '../../controllers/reservations/reservation.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { body, query, param } from 'express-validator';

const router = Router();
const reservationController = new ReservationController();

// Validación de creación de reserva
const createReservationValidation = [
  body('bookId').isMongoId()
];

// Validación de búsqueda
const searchValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'completed', 'cancelled'])
];

// Validación de parámetros de reserva
const reservationParamValidation = [
  param('reservationId').isMongoId()
];

// Todas las rutas de reservas requieren autenticación
router.use(authenticateToken);

// Rutas de reservas
router.post(
  '/',
  createReservationValidation,
  reservationController.createReservation
);

// Obtener reservas del usuario autenticado
router.get(
  '/my-reservations',
  searchValidation,
  reservationController.getUserReservations
);

// Obtener historial de reservas de un libro
router.get(
  '/book/:bookId',
  searchValidation,
  reservationController.getBookReservations
);

// Completar una reserva
router.put(
  '/:reservationId/complete',
  reservationParamValidation,
  reservationController.completeReservation
);

// Cancelar una reserva
router.put(
  '/:reservationId/cancel',
  reservationController.cancelReservation
);

export default router;
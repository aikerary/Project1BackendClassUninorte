import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';

export const cancelReservationAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.params;
    const userId = req.user!.userId;

    const reservation = await ReservationModel.findById(reservationId);
    if (!reservation) {
      res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
      return;
    }

    if (reservation.userId.toString() !== userId && !req.user!.permissions.includes('modify_users')) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this reservation'
      });
      return;
    }

    if (reservation.status !== 'active') {
      res.status(400).json({
        success: false,
        error: 'Reservation is not active'
      });
      return;
    }

    reservation.status = 'cancelled';
    await reservation.save();

    await BookModel.findByIdAndUpdate(reservation.bookId, { isAvailable: true });

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error cancelling reservation'
    });
  }
};

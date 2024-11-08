import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';

export const completeReservationAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.params;

    const reservation = await ReservationModel.findOneAndUpdate(
      { _id: reservationId, status: 'active' },
      { 
        status: 'completed',
        returnDate: new Date()
      },
      { new: true }
    );

    if (!reservation) {
      res.status(404).json({
        success: false,
        error: 'Active reservation not found'
      });
      return;
    }

    // Update book's available copies and availability status
    const book = await BookModel.findOneAndUpdate(
      { _id: reservation.bookId },
      {
        $inc: { availableCopies: 1 },
        $set: { isAvailable: true }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        reservation,
        book: {
          availableCopies: book?.availableCopies,
          totalCopies: book?.totalCopies
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error completing reservation'
    });
  }
};

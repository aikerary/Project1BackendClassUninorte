import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';

export const createReservationAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.body;
    const userId = req.user!.userId;

    const book = await BookModel.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found'
      });
      return;
    }

    if (!book.isAvailable) {
      res.status(400).json({
        success: false,
        error: 'Book is not available for reservation'
      });
      return;
    }

    const reservation = await ReservationModel.create({
      userId,
      bookId,
      reservationDate: new Date(),
      status: 'active'
    });

    await BookModel.findByIdAndUpdate(bookId, { isAvailable: false });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error creating reservation'
    });
  }
};

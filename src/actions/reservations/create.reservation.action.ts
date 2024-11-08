import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';

export const createReservationAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.body;
    const userId = req.user!.userId;

    // Use findOneAndUpdate to atomically check and update the book
    const book = await BookModel.findOneAndUpdate(
      {
        _id: bookId,
        availableCopies: { $gt: 0 },
        isActive: true
      },
      {
        $inc: { availableCopies: -1 },
        $set: { isAvailable: false }
      },
      { new: true }
    );

    if (!book) {
      res.status(400).json({
        success: false,
        error: 'Book is not available for reservation'
      });
      return;
    }

    // If book was found and updated, create the reservation
    const reservation = await ReservationModel.create({
      userId,
      bookId,
      reservationDate: new Date(),
      status: 'active'
    });

    // Update isAvailable based on availableCopies
    if (book.availableCopies === 0) {
      await BookModel.findByIdAndUpdate(bookId, { isAvailable: false });
    }

    res.status(201).json({
      success: true,
      data: {
        ...reservation.toObject(),
        book: {
          availableCopies: book.availableCopies,
          totalCopies: book.totalCopies
        }
      }
    });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating reservation'
    });
  }
};

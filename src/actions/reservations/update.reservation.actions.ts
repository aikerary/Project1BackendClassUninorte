import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';

export const completeReservationAction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Invalid reservation ID format'
      });
      return;
    }

    const { reservationId } = req.params;
    const userId = req.user!.userId;
    
    // Find reservation and check ownership
    const reservation = await ReservationModel.findOne({
      _id: reservationId,
      status: 'active'
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        error: 'Active reservation not found'
      });
      return;
    }

    // Check if user owns the reservation or has admin permissions
    if (reservation.userId.toString() !== userId && 
        !req.user!.permissions.includes('modify_books')) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to complete this reservation'
      });
      return;
    }

    // Update reservation status
    reservation.status = 'completed';
    reservation.returnDate = new Date();
    await reservation.save();

    // Update book availability
    const book = await BookModel.findOneAndUpdate(
      { _id: reservation.bookId },
      {
        $inc: { availableCopies: 1 },
        $set: { isAvailable: true }
      },
      { new: true }
    );

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Associated book not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        reservation,
        book: {
          availableCopies: book.availableCopies,
          totalCopies: book.totalCopies
        }
      }
    });
  } catch (error) {
    console.error('Complete reservation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error completing reservation',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

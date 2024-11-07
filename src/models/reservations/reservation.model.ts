import mongoose from 'mongoose';
import type { IUser } from '../users/user.model.js';
import type { IBook } from '../books/book.model.js';

export interface IReservation extends mongoose.Document {
  userId: IUser['_id'];
  bookId: IBook['_id'];
  reservationDate: Date;
  returnDate: Date | null;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new mongoose.Schema<IReservation>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  reservationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true,
  versionKey: false
});

export const ReservationModel = mongoose.model<IReservation>('Reservation', reservationSchema);
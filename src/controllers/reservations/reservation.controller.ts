// src/controllers/reservations/reservation.controller.ts
import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import { BookModel } from '../../models/books/book.model.js';
import type { ReservationFilters } from '../../models/types.js';

export class ReservationController {
  // Crear reserva
  async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.body;
      const userId = req.user!.userId;

      // Verificar disponibilidad del libro
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

      // Crear reserva y actualizar disponibilidad del libro
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
  }

  // Obtener una reserva específica
  async getReservation(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;
      
      const reservation = await ReservationModel.findById(reservationId)
        .populate('bookId', 'title author')
        .populate('userId', 'name email');

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found'
        });
      }

      return res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching reservation'
      });
    }
  }

  // Obtener reservas del usuario
  async getUserReservations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { status, page = 1, limit = 10 } = req.query;

      const query: ReservationFilters = { userId };
      if (status) {
        query.status = status as 'active' | 'completed' | 'cancelled';
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [reservations, total] = await Promise.all([
        ReservationModel.find(query)
          .populate('bookId', 'title author')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        ReservationModel.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: {
          reservations,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching reservations'
      });
    }
  }

  // Obtener historial de reservas de un libro
  async getBookReservations(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const query: ReservationFilters = { bookId };
      if (status) {
        query.status = status as 'active' | 'completed' | 'cancelled';
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [reservations, total] = await Promise.all([
        ReservationModel.find(query)
          .populate('userId', 'name email')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        ReservationModel.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: {
          reservations,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching book reservations'
      });
    }
  }

  // Finalizar reserva
  async completeReservation(req: Request, res: Response): Promise<void> {
    try {
      const { reservationId } = req.params;

      const reservation = await ReservationModel.findById(reservationId);
      if (!reservation) {
        res.status(404).json({
          success: false,
          error: 'Reservation not found'
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

      // Actualizar reserva y libro
      reservation.status = 'completed';
      reservation.returnDate = new Date();
      await reservation.save();

      await BookModel.findByIdAndUpdate(reservation.bookId, { isAvailable: true });

      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error completing reservation'
      });
    }
  }

  // Cancelar reserva
  async cancelReservation(req: Request, res: Response): Promise<void> {
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

      // Verificar que la reserva pertenezca al usuario o sea admin
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

      // Actualizar reserva y libro
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
  }

  // Buscar reservas (para administradores)
  async searchReservations(req: Request, res: Response) {
    try {
      const {
        userId,
        bookId,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10
      } = req.query;

      const query: ReservationFilters = {};

      if (userId) query.userId = userId as string;
      if (bookId) query.bookId = bookId as string;
      if (status) query.status = status as 'active' | 'completed' | 'cancelled';
      
      if (startDate || endDate) {
        query.reservationDate = {};
        if (startDate) query.reservationDate.$gte = new Date(startDate as string);
        if (endDate) query.reservationDate.$lte = new Date(endDate as string);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [reservations, total] = await Promise.all([
        ReservationModel.find(query)
          .populate('userId', 'name email')
          .populate('bookId', 'title author')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        ReservationModel.countDocuments(query)
      ]);

      return res.json({
        success: true,
        data: {
          reservations,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error searching reservations'
      });
    }
  }
}
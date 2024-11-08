import { Request, Response } from 'express';
import { ReservationModel } from '../../models/reservations/reservation.model.js';
import type { ReservationFilters } from '../../models/types.js';

export const getReservationAction = async (req: Request, res: Response) => {
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
};

export const getUserReservationsAction = async (req: Request, res: Response): Promise<void> => {
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
};

export const getBookReservationsAction = async (req: Request, res: Response): Promise<void> => {
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
};

export const searchReservationsAction = async (req: Request, res: Response) => {
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
};

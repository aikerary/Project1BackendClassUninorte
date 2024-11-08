// src/controllers/reservations/reservation.controller.ts
import { Request, Response } from 'express';
import { createReservationAction } from '../../actions/reservations/create.reservation.action.js';
import { getReservationAction } from '../../actions/reservations/read.reservation.action.js';
import { getUserReservationsAction, getBookReservationsAction, searchReservationsAction } from '../../actions/reservations/read.reservation.action.js';
import { completeReservationAction } from '../../actions/reservations/update.reservation.actions.js';
import { cancelReservationAction } from '../../actions/reservations/delete.reservation.action.js';

export class ReservationController {
  async createReservation(req: Request, res: Response): Promise<void> {
    await createReservationAction(req, res);
  }

  async getReservation(req: Request, res: Response) {
    await getReservationAction(req, res);
  }

  async getUserReservations(req: Request, res: Response): Promise<void> {
    await getUserReservationsAction(req, res);
  }

  async getBookReservations(req: Request, res: Response): Promise<void> {
    await getBookReservationsAction(req, res);
  }

  async completeReservation(req: Request, res: Response): Promise<void> {
    await completeReservationAction(req, res);
  }

  async cancelReservation(req: Request, res: Response): Promise<void> {
    await cancelReservationAction(req, res);
  }

  async searchReservations(req: Request, res: Response) {
    await searchReservationsAction(req, res);
  }
}
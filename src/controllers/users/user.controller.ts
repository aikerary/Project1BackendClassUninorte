// src/controllers/users/user.controller.ts
import { Request, Response } from 'express';
import { CreateUserAction } from '../../actions/users/create.user.action.js';
import { ReadUserAction } from '../../actions/users/read.user.action.js';
import { UpdateUserAction } from '../../actions/users/update.user.action.js';
import { DeleteUserAction } from '../../actions/users/delete.user.action.js';

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const action = new CreateUserAction();
      const result = await action.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error creating user'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const action = new ReadUserAction();
      const result = await action.login(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error during login'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const action = new UpdateUserAction();
      const result = await action.execute(req.params.userId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error updating user'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const action = new DeleteUserAction();
      await action.execute(req.params.userId);
      res.status(200).json({
        success: true,
        message: 'User successfully deactivated'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error deactivating user'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const action = new ReadUserAction();
      const result = await action.getUserById(req.params.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching user'
      });
    }
  }
}
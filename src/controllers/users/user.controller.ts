// src/controllers/users/user.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../config/auth.js';
import { UserModel } from '../../models/users/user.model.js';

export class UserController {
  // Registro de usuario
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear nuevo usuario
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        permissions: [] // Usuario nuevo sin permisos especiales
      });

      // Generar token
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            permissions: user.permissions
          },
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error creating user'
      });
    }
  }

  // Login de usuario
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await UserModel.findOne({ email, isActive: true });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generar token
      const token = generateToken(user);

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            permissions: user.permissions
          },
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error during login'
      });
    }
  }

  // Actualizar usuario
  async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      // No permitir actualización de contraseña por esta ruta
      delete updates.password;
      
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error updating user'
      });
    }
  }

  // Soft delete de usuario
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { isActive: false } },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        message: 'User successfully deactivated'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error deactivating user'
      });
    }
  }

  // Obtener usuario por ID
  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const user = await UserModel.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching user'
      });
    }
  }
}
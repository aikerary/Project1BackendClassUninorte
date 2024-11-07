import jwt from 'jsonwebtoken';
import type { IUser } from '../models/users/user.model.js';
import type { Permission } from '../models/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  permissions: Permission[];
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    permissions: user.permissions
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
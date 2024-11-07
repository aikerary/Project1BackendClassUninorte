import mongoose from 'mongoose';
import type { Permission } from '../types.js';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'create_books',
      'modify_books',
      'disable_books',
      'modify_users',
      'disable_users'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
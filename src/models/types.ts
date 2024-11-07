// src/models/types.ts
export type Permission = 
  | 'create_books'
  | 'modify_books'
  | 'disable_books'
  | 'modify_users'
  | 'disable_users';

export interface BaseDocument {
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
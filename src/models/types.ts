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

export interface BookFilters {
  genre?: string;
  publisher?: string;
  author?: string;
  title?: string;
  isAvailable?: boolean;
  publishDateStart?: string;
  publishDateEnd?: string;
  includeInactive?: boolean;
}

export interface ReservationFilters {
  userId?: string;
  bookId?: string;
  status?: 'active' | 'completed' | 'cancelled';
  reservationDate?: {
    $gte?: Date;
    $lte?: Date;
  };
}
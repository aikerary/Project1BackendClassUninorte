import mongoose from 'mongoose';
import type { Book } from '../types.js';

// Interfaz para el documento de Mongoose
export interface IBook extends Omit<Book, keyof mongoose.Document>, mongoose.Document {}

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export const BookModel = mongoose.model<IBook>('Book', bookSchema);

// Función auxiliar para convertir documento a tipo Book
export const toBook = (doc: IBook): Book => {
  const book = doc.toObject();
  return {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    publisher: book.publisher,
    publishDate: book.publishDate,
    description: book.description,
    isAvailable: book.isAvailable,
    coverImage: book.coverImage,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    isActive: book.isActive,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
};
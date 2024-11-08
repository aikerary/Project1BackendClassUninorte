import mongoose from 'mongoose';
import type { Book } from '../types.js';

// Interfaz para el documento de Mongoose
export interface IBook extends Omit<Book, keyof mongoose.Document>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

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
  isbn: {
    type: String,
    required: true,
    unique: true,
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
  description: {
    type: String,
    required: true,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
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

export const toBook = (doc: IBook): Book => {
  const book = doc.toObject();
  return {
    id: doc._id.toString(),
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    publisher: book.publisher,
    publishDate: book.publishDate,
    description: book.description,
    isAvailable: book.isAvailable,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    isActive: book.isActive,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
};
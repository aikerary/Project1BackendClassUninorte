import mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  publishDate: Date;
  publisher: string;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema<IBook>({
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
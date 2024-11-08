import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book } from '../../models/types.js';

export class CreateBookAction {
  async execute(bookData: Partial<Book>): Promise<Book> {
    try {
      const bookDocument = await BookModel.create(bookData);
      return toBook(bookDocument);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          throw new Error('A book with this ISBN already exists');
        }
        if (error.name === 'ValidationError') {
          throw new Error('Invalid book data: ' + error.message);
        }
      }
      throw new Error('Failed to create book');
    }
  }
}

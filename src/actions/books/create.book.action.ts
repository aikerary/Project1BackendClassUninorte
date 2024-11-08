import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book } from '../../models/types.js';

export class CreateBookAction {
  async execute(bookData: Partial<Book>): Promise<Book> {
    try {
      const bookDocument = await BookModel.create(bookData);
      return toBook(bookDocument);
    } catch (error) {
      throw new Error('Failed to create book');
    }
  }
}

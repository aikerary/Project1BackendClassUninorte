import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book } from '../../models/types.js';

export class UpdateBookAction {
  async execute(bookId: string, updates: Partial<Book>): Promise<Book | null> {
    try {
      const doc = await BookModel.findByIdAndUpdate(
        bookId,
        { $set: updates },
        { new: true }
      );
      return doc ? toBook(doc) : null;
    } catch (error) {
      throw new Error('Failed to update book');
    }
  }
}

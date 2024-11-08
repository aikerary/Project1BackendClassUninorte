import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book } from '../../models/types.js';

export class DeleteBookAction {
  async execute(bookId: string): Promise<Book | null> {
    try {
      const doc = await BookModel.findByIdAndUpdate(
        bookId,
        { $set: { isActive: false } },
        { new: true }
      );
      return doc ? toBook(doc) : null;
    } catch (error) {
      throw new Error('Failed to deactivate book');
    }
  }
}

import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book, BookFilters } from '../../models/types.js';

export class ReadBookAction {
  async findById(bookId: string): Promise<Book | null> {
    try {
      const doc = await BookModel.findById(bookId);
      return doc ? toBook(doc) : null;
    } catch (error) {
      throw new Error('Failed to fetch book');
    }
  }

  async search(filters: BookFilters, page: number, limit: number) {
    try {
      const query: any = {};
      
      if (filters.genre) query.genre = new RegExp(filters.genre, 'i');
      if (filters.publisher) query.publisher = new RegExp(filters.publisher, 'i');
      if (filters.author) query.author = new RegExp(filters.author, 'i');
      if (filters.title) query.title = new RegExp(filters.title, 'i');
      if (filters.isAvailable !== undefined) query.isAvailable = filters.isAvailable;
      if (filters.publishDateStart || filters.publishDateEnd) {
        query.publishDate = {};
        if (filters.publishDateStart) query.publishDate.$gte = new Date(filters.publishDateStart);
        if (filters.publishDateEnd) query.publishDate.$lte = new Date(filters.publishDateEnd);
      }
      
      if (!filters.includeInactive) {
        query.isActive = true;
      }

      const skip = (page - 1) * limit;
      
      const [docs, total] = await Promise.all([
        BookModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        BookModel.countDocuments(query)
      ]);

      return {
        books: docs.map(toBook),
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Failed to search books');
    }
  }
}

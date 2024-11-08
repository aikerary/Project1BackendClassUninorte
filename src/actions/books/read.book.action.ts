import { BookModel, toBook } from '../../models/books/book.model.js';
import type { Book, BookFilters } from '../../models/types.js';

// src/actions/books/read.book.action.ts
export class ReadBookAction {
  async findById(id: string): Promise<Book | null> {
    try {
      const book = await BookModel.findById(id);
      return book ? toBook(book) : null;
    } catch (error) {
      throw new Error('Error finding book');
    }
  }

  async search(filters: BookFilters, page: number = 1, limit: number = 10) {
    try {
      const query: any = {};
      
      // Only add isActive filter if explicitly requested
      if (filters.includeInactive === false) {
        query.isActive = true;
      }

      console.log('Search query:', JSON.stringify(query)); // Debug log
      
      const skip = (page - 1) * limit;
      
      const [docs, total] = await Promise.all([
        BookModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .select('-__v'),
        BookModel.countDocuments(query)
      ]);

      console.log('Found documents:', docs.length); // Debug log

      return {
        books: docs.map(toBook),
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Search error:', error); // Debug log
      throw new Error('Failed to search books');
    }
  }
}

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateBookAction } from '../../actions/books/create.book.action.js';
import { ReadBookAction } from '../../actions/books/read.book.action.js';
import { UpdateBookAction } from '../../actions/books/update.book.action.js';
import { DeleteBookAction } from '../../actions/books/delete.book.action.js';
import type { BookFilters } from '../../models/types.js';

export class BookController {
  private createBookAction = new CreateBookAction();
  private readBookAction = new ReadBookAction();
  private updateBookAction = new UpdateBookAction();
  private deleteBookAction = new DeleteBookAction();

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const book = await this.createBookAction.execute(req.body);
      
      res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('duplicate') ? 409 : 500;
      const message = error instanceof Error ? error.message : 'Error creating book';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      
      const book = await this.readBookAction.findById(bookId);
      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching book'
      });
    }
  }

  searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        genre,
        publisher,
        author,
        title,
        isAvailable,
        publishDateStart,
        publishDateEnd,
        includeInactive,
        page = 1,
        limit = 10
      } = req.query;

      const filters: BookFilters = {
        genre: genre as string,
        publisher: publisher as string,
        author: author as string,
        title: title as string,
        isAvailable: isAvailable === 'true',
        publishDateStart: publishDateStart as string,
        publishDateEnd: publishDateEnd as string,
        includeInactive: includeInactive === 'true'
      };

      const result = await this.readBookAction.search(
        filters,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: {
          books: result.books,
          pagination: {
            total: result.total,
            page: result.page,
            pages: result.pages
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error searching books'
      });
    }
  }

  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const updates = req.body;
      
      const book = await this.updateBookAction.execute(bookId, updates);

      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating book'
      });
    }
  }

  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      
      const book = await this.deleteBookAction.execute(bookId);

      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Book successfully deactivated'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error deactivating book'
      });
    }
  }
}
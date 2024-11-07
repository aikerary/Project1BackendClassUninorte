// src/controllers/books/book.controller.ts
import { Request, Response } from 'express';
import { BookModel } from '../../models/books/book.model.js';
import type { BookFilters } from '../../models/types.js';

export class BookController {
  // Crear libro
  async createBook(req: Request, res: Response) {
    try {
      const book = await BookModel.create(req.body);
      
      return res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error creating book'
      });
    }
  }

  // Obtener libro por ID
  async getBookById(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      
      const book = await BookModel.findById(bookId);
      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      return res.json({
        success: true,
        data: book
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching book'
      });
    }
  }

  // Buscar libros con filtros
  async searchBooks(req: Request, res: Response) {
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

      const filters: BookFilters = {};
      const query: any = {};

      // Aplicar filtros
      if (genre) query.genre = new RegExp(genre as string, 'i');
      if (publisher) query.publisher = new RegExp(publisher as string, 'i');
      if (author) query.author = new RegExp(author as string, 'i');
      if (title) query.title = new RegExp(title as string, 'i');
      if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
      if (publishDateStart || publishDateEnd) {
        query.publishDate = {};
        if (publishDateStart) query.publishDate.$gte = new Date(publishDateStart as string);
        if (publishDateEnd) query.publishDate.$lte = new Date(publishDateEnd as string);
      }
      
      // Incluir/excluir inactivos
      if (!includeInactive || includeInactive === 'false') {
        query.isActive = true;
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const [books, total] = await Promise.all([
        BookModel.find(query)
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        BookModel.countDocuments(query)
      ]);

      return res.json({
        success: true,
        data: {
          books,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error searching books'
      });
    }
  }

  // Actualizar libro
  async updateBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const updates = req.body;
      
      const book = await BookModel.findByIdAndUpdate(
        bookId,
        { $set: updates },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      return res.json({
        success: true,
        data: book
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error updating book'
      });
    }
  }

  // Soft delete de libro
  async deleteBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      
      const book = await BookModel.findByIdAndUpdate(
        bookId,
        { $set: { isActive: false } },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      return res.json({
        success: true,
        message: 'Book successfully deactivated'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error deactivating book'
      });
    }
  }
}
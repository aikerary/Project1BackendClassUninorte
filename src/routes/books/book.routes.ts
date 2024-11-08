// src/routes/books/book.routes.ts
import { Router } from 'express';
import { BookController } from '../../controllers/books/book.controller.js';
import { authenticateToken, requirePermissions } from '../../middleware/auth.middleware.js';
import { body, query } from 'express-validator';

const router = Router();
const bookController = new BookController();

// Validación de creación de libro
const createBookValidation = [
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
  body('isbn').trim().notEmpty(),
  body('genre').trim().notEmpty(),
  body('publishDate').isISO8601().toDate(),
  body('publisher').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('totalCopies').isInt({ min: 0 }),
  body('availableCopies').isInt({ min: 0 }).custom((value, { req }) => {
    return value <= req.body.totalCopies;
  })
];

// Validación de búsqueda
const searchValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('publishDateStart').optional().isISO8601(),
  query('publishDateEnd').optional().isISO8601(),
];

// Rutas públicas - búsqueda y obtención de libros
router.get('/', searchValidation, bookController.searchBooks);
router.get('/:bookId', bookController.getBookById);

// Rutas protegidas - gestión de libros
router.post(
  '/',
  authenticateToken,
  requirePermissions(['create_books']),
  createBookValidation,
  bookController.createBook
);

router.put(
  '/:bookId',
  authenticateToken,
  requirePermissions(['modify_books']),
  bookController.updateBook
);

router.delete(
  '/:bookId',
  authenticateToken,
  requirePermissions(['disable_books']),
  bookController.deleteBook
);

export default router;
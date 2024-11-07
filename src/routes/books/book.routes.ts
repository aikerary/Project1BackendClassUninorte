import { Router } from 'express';
import { createBook, getBooks, updateBook, deleteBook } from '../../controllers/books/book.controller';

const router = Router();

router.post('/', createBook); // Create book (Requires 'create_books' permission)
router.get('/', getBooks); // Read books with filters
router.put('/:id', updateBook); // Update book (Requires 'modify_books' permission)
router.delete('/:id', deleteBook); // Delete book (Soft delete, requires 'disable_books' permission)

export default router;

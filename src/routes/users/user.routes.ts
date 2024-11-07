import { Router } from 'express';
import { registerUser, loginUser, updateUser, deleteUser } from '../../controllers/users/user.controller';

const router = Router();

router.post('/register', registerUser); // Create (Registration)
router.post('/login', loginUser); // Read (Login)
router.put('/:id', updateUser); // Update user (Requires authentication)
router.delete('/:id', deleteUser); // Delete user (Soft delete, requires authentication)

export default router;

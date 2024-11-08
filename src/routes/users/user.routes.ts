// src/routes/users/user.routes.ts
import { Router } from 'express';
import { UserController } from '../../controllers/users/user.controller.js';
import { authenticateToken, requirePermissions, isSameUserOrHasPermission } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = Router();
const userController = new UserController();

// Validación de registro
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
];

// Validación de login
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Rutas públicas
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);

// Rutas protegidas
router.get(
  '/profile/:userId',
  authenticateToken,
  isSameUserOrHasPermission('modify_users'),
  userController.getUserById
);

router.put(
  '/:userId',
  authenticateToken,
  isSameUserOrHasPermission('modify_users'),
  userController.updateUser
);

router.delete(
  '/:userId',
  authenticateToken,
  isSameUserOrHasPermission('disable_users'),
  userController.deleteUser
);

export default router;
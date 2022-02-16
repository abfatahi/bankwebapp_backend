import express from 'express';
import { body, header } from 'express-validator';
import { SharedMiddleware } from '../middlewares/index.js';
import Controller from '../controllers/User.js';

const UserController = Controller();

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName', 'Failed! Fullname field cannot be blank')
      .exists()
      .bail()
      .isString()
      .withMessage('Failed! Fullname must be a string')
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage('Fullname should have 4 to 20 characters'),
    body('email', 'Failed! Email cant be blank')
      .exists()
      .isEmail()
      .withMessage('Invalid Email format')
      .custom((email) => SharedMiddleware.isUniqueEmail(email)),
    body('password', 'Failed! Password cannot be blank')
      .exists()
      .isLength({ min: 8 })
      .withMessage('Password must be 8 characters or more'),
  ],
  UserController.register
);

export default router;

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

router.post(
  '/login',
  [
    body('email', 'Failed! Email cant be blank')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password cant be blank')
      .exists()
      .bail()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password cant be empty'),
  ],
  UserController.login
);

router.get(
  '/transactions/all',
  [
    header(
      'Authorization',
      'Unauthorized! Sign in to your account for authorization'
    )
      .exists()
      .bail()
      .custom((value) => SharedMiddleware.isValidUserToken(value)),
  ],
  UserController.allTransactions
);

router.get(
  '/details',
  [
    header(
      'Authorization',
      'Unauthorized! Sign in to your account for authorization'
    )
      .exists()
      .bail()
      .custom((value) => SharedMiddleware.isValidUserToken(value)),
  ],
  UserController.getUserDetails
);

export default router;

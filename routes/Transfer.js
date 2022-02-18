import express from 'express';
import { body, header } from 'express-validator';
import { SharedMiddleware } from '../middlewares/index.js';
import Controller from '../controllers/Transfer.js';

const TransferController = Controller();

const router = express.Router();

router.post(
  '/new',
  [
    header(
      'Authorization',
      'Unauthorized! Sign in to your account for authorization'
    )
      .exists()
      .bail()
      .custom((value) => SharedMiddleware.isValidUserToken(value)),
    body('sender', 'Failed! Sender field cannot be blank')
      .exists()
      .bail()
      .isInt()
      .withMessage('Failed! Sender account number must be an Integer')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Sender account number should have 10 characters'),
    body('receiver', 'Failed! Receiver field cannot be blank')
      .exists()
      .bail()
      .isInt()
      .withMessage('Failed! Receiver account number must be an Integer')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Receiver account number should have 10 characters'),
    body('amount', 'Failed! Amount cannot be blank')
      .exists()
      .isNumeric()
      .withMessage('Failed! Amount should be a number')
      .trim(),
    body('sourceCurrency', 'Failed! SourceCurrency cannot be blank').exists(),
    body('targetCurrency', 'Failed! SourceCurrency cannot be blank').exists(),
  ],
  TransferController.newTransfer
);

export default router;

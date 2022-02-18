import { UserModel, TransferModel } from '../database/models/index.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export default () => {
  const newTransfer = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const tokenData = jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET
      );

      const User = await UserModel.findOne({ email: tokenData.email });

      const { sourceCurrency, targetCurrency, sender, receiver, amount } =
        req.body;

      //Check sufficient funds
      if (
        sourceCurrency === 'USD' &&
        parseFloat(User.USDBalance) < parseFloat(amount)
      ) {
        return res.status(400).json({
          errors: [
            {
              message: `Failed! Your ${sourceCurrency} balance is insufficient to perfom this transaction`,
            },
          ],
        });
      }

      if (
        sourceCurrency === 'EUR' &&
        parseFloat(User.EURBalance) < parseFloat(amount)
      ) {
        return res.status(400).json({
          errors: [
            {
              message: `Failed! Your ${sourceCurrency} balance is insufficient to perfom this transaction`,
            },
          ],
        });
      }

      if (
        sourceCurrency === 'NGN' &&
        parseFloat(User.NGNBalance) < parseFloat(amount)
      ) {
        return res.status(400).json({
          errors: [
            {
              message: `Failed! Your ${sourceCurrency} balance is insufficient to perfom this transaction`,
            },
          ],
        });
      }

      //Generate New Transfer ID
      const totalTransactions = await TransferModel.find();
      const transactionId = `REF-10000${totalTransactions.length + 1}`;

      //Debit Source Account
      if (sourceCurrency === 'USD') {
        const newUSDBalance = parseFloat(User.USDBalance) - parseFloat(amount);
        User.USDBalance = newUSDBalance;
      }
      if (sourceCurrency === 'EUR') {
        const newEURBalance = parseFloat(User.EURBalance) - parseFloat(amount);
        User.EURBalance = newEURBalance;
      }
      if (sourceCurrency === 'NGN') {
        const newNGNBalance = parseFloat(User.NGNBalance) - parseFloat(amount);
        User.NGNBalance = newNGNBalance;
      }
      User.save();

      //Credit Destination Account
      const Receiver = await UserModel.findOne({ accountNumber: receiver });
      if (!Receiver) {
        const newTransaction = new TransferModel({
          transactionId,
          sender,
          receiver,
          amount,
          sourceCurrency,
          targetCurrency,
          status: 'failed',
        });
        newTransaction.save();
        return res.status(400).json({
          errors: [
            {
              message: `Failed! Invalid Recipient`,
            },
          ],
        });
      }

      if (targetCurrency === 'USD') {
        if (sourceCurrency === 'NGN') {
          const newUSDBalance =
            parseFloat(Receiver.USDBalance) + parseFloat(amount) * 416;
          Receiver.USDBalance = newUSDBalance;
        }
        if (sourceCurrency === 'EUR') {
          const newUSDBalance =
            parseFloat(Receiver.USDBalance) + parseFloat(amount) * 0.88;
          Receiver.USDBalance = newUSDBalance;
        }
        if (sourceCurrency === 'USD') {
          const newUSDBalance =
            parseFloat(Receiver.USDBalance) + parseFloat(amount);
          Receiver.USDBalance = newUSDBalance;
        }
      }
      if (targetCurrency === 'EUR') {
        if (sourceCurrency === 'NGN') {
          const newEURBalance =
            parseFloat(Receiver.EURBalance) + parseFloat(amount) * 0.0021;
          Receiver.EURBalance = newEURBalance;
        }
        if (sourceCurrency === 'USD') {
          const newUSDBalance =
            parseFloat(Receiver.EURBalance) + parseFloat(amount) * 0.88;
          Receiver.USDBalance = newUSDBalance;
        }
        if (sourceCurrency === 'EUR') {
          const newEURBalance =
            parseFloat(Receiver.EURBalance) + parseFloat(amount);
          Receiver.EURBalance = newEURBalance;
        }
      }
      if (targetCurrency === 'NGN') {
        if (sourceCurrency === 'NGN') {
          const newNGNBalance =
            parseFloat(Receiver.NGNBalance) + parseFloat(amount);
          Receiver.NGNBalance = newNGNBalance;
        }
        if (sourceCurrency === 'USD') {
          const newNGNBalance =
            parseFloat(Receiver.NGNBalance) + parseFloat(amount) * 416;
          Receiver.NGNBalance = newNGNBalance;
        }
        if (sourceCurrency === 'EUR') {
          const newNGNBalance =
            parseFloat(Receiver.NGNBalance) + parseFloat(amount) * 475;
          Receiver.NGNBalance = newNGNBalance;
        }
      }
      Receiver.save();

      const newTransaction = new TransferModel({
        transactionId,
        sender,
        receiver,
        amount,
        sourceCurrency,
        targetCurrency,
        status: 'success',
      });
      newTransaction.save();

      return res.status(200).json({
        status: 'success',
        data: {
          transactionId,
          sender,
          receiver,
          amount,
          sourceCurrency,
          targetCurrency,
          status: 'success',
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    newTransfer,
  };
};

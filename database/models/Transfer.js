import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      default: 'pending',
    },
    sourceCurrency: {
      type: String,
    },
    targetCurrency: {
      type: String,
    },
  },
  { timestamps: true }
);

const TransferModel = mongoose.model('TransferModel', TransferSchema);

export default TransferModel;

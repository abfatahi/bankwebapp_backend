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
    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

const TransferModel = mongoose.model('TransferModel', TransferSchema);

export default TransferModel;

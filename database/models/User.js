import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    bookBalance: {
      type: Number,
    },
    USDBalance: {
      type: Number,
      default: 1000,
    },
    EURBalance: {
      type: Number,
      default: 0.0,
    },
    NGNBalance: {
      type: Number,
      default: 0.0,
    },
    availableBalance: {
      type: Number,
    },
    authCode: {
      type: Number,
      trim: true,
    },
    beneficiaries: {
      type: Array,
      default: [
        { value: 2300000001, name: 'Ishaq Abdulfatahi' },
        { value: 2300000002, name: 'Nuri Sahin' },
        { value: 2300000003, name: 'Mesut Oezil' },
        { value: 2300000004, name: 'Mark Ruffalo' },
        { value: 2300000005, name: 'James Wellberg' },
        { value: 2300000006, name: 'John Fuller' },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('UserModel', UserSchema);

export default UserModel;

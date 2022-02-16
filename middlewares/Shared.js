import { UserModel } from '../../database/models/index.js';
import jwt from 'jsonwebtoken';

const isUniqueEmail = async (email) => {
  const emailExist = await UserModel.findOne({ email });
  if (emailExist) throw new Error('Failed! Email already in use');

  return true;
};

const isUniqueUsername = async (username) => {
  const usernameExist = await UserModel.findOne({ username });
  if (usernameExist) throw new Error('Failed! Username already in use');

  return true;
};

const isEmailExist = async (email) => {
  const emailExist = await UserModel.findOne({ email });
  if (!emailExist) throw new Error('Failed! User account does not exist');

  return true;
};

const isValidUserToken = async (value) => {
  const token = value.split(' ')[1];
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenData) throw new Error(tokenData);

  const isUser = await UserModel.findOne({
    where: { email: tokenData.email },
  });
  if (!isUser) throw new Error('Unauthorized!');

  return true;
};

export default {
  isUniqueEmail,
  isUniqueUsername,
  isEmailExist,
  isValidUserToken,
};

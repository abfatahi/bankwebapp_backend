// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { UserModel } from '../database/models/index.js';

export default () => {
  const register = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      //hash password
      const new_password = await bcrypt.hash(
        req.body.password,
        bcrypt.genSaltSync(10)
      );

      //convert Email to lowercase
      const new_email = req.body.email.toLowerCase();

      //Generate account number
      const users = await UserModel.find();
      const accountNumber = 2300000000 + users.length + 1;

      //create User
      const newUser = new UserModel({
        fullName: req.body.fullName,
        email: new_email,
        accountNumber,
        password: new_password,
      });
      newUser.save();

      const { fullName, email } = req.body;

      return res
        .status(200)
        .json({ status: 'success', data: { fullName, accountNumber, email } });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const login = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // Authentication Logic
      const { email, password } = req.body;

      const User = await UserModel.findOne({ email });

      if (!User)
        return res
          .status(400)
          .json({ errors: [{ message: 'Failed! Invalid login details' }] });

      // compare password
      const isValidPassword = await bcrypt.compare(password, User.password);
      if (!isValidPassword)
        return res
          .status(400)
          .json({ errors: [{ message: 'Failed! Incorrect password' }] });

      // Generate customer token
      const token = jwt.sign({ email: User.email }, process.env.JWT_SECRET, {
        expiresIn: '10d',
      });

      const {
        fullname,
        email,
        USDBalance,
        EURBalance,
        NGNBalance,
        accountNumber,
        isActive,
        beneficiaries,
      } = User;

      return res.status(200).json({
        status: 'success',
        data: {
          fullname,
          email,
          USDBalance,
          EURBalance,
          NGNBalance,
          accountNumber,
          isActive,
          beneficiaries,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    register,
    login,
  };
};

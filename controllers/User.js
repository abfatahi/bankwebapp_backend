// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { UserModel } from '../database/models';

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

      const newUser = new UserModel({
        fullName: req.body.fullName,
        email: new_email,
        accountNumber,
        password: new_password,
      });

      newUser.save();
      return res
        .status(200)
        .json({ status: 'success', data: { fullName, accountNumber, email } });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    register,
  };
};

import express from 'express';
import validateInput from '../shared/validations/login';
import User from './../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();

router.post('/', (req, res) => {
  const { identifier, password } = req.body;

  return User
    .findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    })
    .then(user => {
      if(user) {
        if(bcrypt.compareSync(password, user.password)) {
          // payload - don't put sensible information here
          const token = jwt.sign({
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
          }, config.jwtSecret);

          res.json({ token });
        } else {
          res.status(401).json({ form: 'Invalid Credentials!' });
        }
      } else {
        res.status(401).json({ form: 'Invalid Credentials!' });
      }
    })
    .catch(err => console.log('DB error', err));
});

export default router;

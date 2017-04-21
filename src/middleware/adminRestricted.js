import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user';

// TODO: is it a good idea to de-duplicate with authenticate.js?
export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if(err) {
        res.status(401).json({ error: 'Failed to authenticate' });
      } else {
        User
          .findOne({ _id: decoded.id })
          .select('username email isAdmin')
          .then(user => {
            if(!user) {
              res.status(404).json({ error: 'No such user' });
            } else if (!user.isAdmin) {
              res.status(403).json({ error: 'User is not an admin' });
            } else {
              req.currentUser = user;
              next();
            }
          });
      }
    });
  } else {
    res.status(403).json({ error: 'No token provided' });
  }
};

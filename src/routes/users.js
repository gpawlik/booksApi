import express from 'express';
import User from './../models/user';
import signupValidations from '../shared/validations/signup';
import adminRestricted from '../middleware/adminRestricted';
import authenticate from '../middleware/authenticate';
import bcrypt from 'bcrypt';
import isEmpty from 'lodash/isEmpty';

let router = express.Router();

// Validate if the username or email already exist
function validateInput(data, otherValidations) {
  let { errors } = otherValidations(data);

  return User
    .findOne({ $or: [{ username: data.username }, { email: data.email }] })
    .then(user => {
      if (user) {
        if (data.username === user.username) {
          errors.username = 'Username already exists';
        }
        if (data.email === user.email) {
          errors.email = 'Email already exists';
        }
      }
      return {
        errors,
        isValid: isEmpty(errors)
      };
    });
}

// Create a user
router.post('/', (req, res) => {
  validateInput(req.body, signupValidations).then(({ errors, isValid }) => {
    if (isValid) {
      const { username, email, password } = req.body;
      const password_hash = bcrypt.hashSync(password, 10);
      const newUser = new User({
        username,
        email,
        password: password_hash,
        createdAt: Date.now()
      });

      newUser
        .save()
        .then(user => res.json({ message: 'User created!', user }))
        .catch(error => res.status(500).json({ error }));
    } else {
    res.status(400).json(errors);
    }
  });
});

// Get all the users
router.get('/', function (req, res) {
  User
    .find()
    .limit(20)
    .sort({ createdAt: 1 })
    .select('username email firstName lastName createdAt')
    .exec((err, users) => {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
});

// Get users by identifier
router.get('/:identifier', function (req, res) {
  const identifier = req.params.identifier;

  User
    .findOne({
      $or: [
        { _id: identifier },
        { username: identifier },
        { email: identifier }
      ]
    })
    .select('_id username email firstName lastName location interests isAdmin allowEmailNotifications allowPushNotifications createdAt')
    .then(user => {
      res.json({ user });
    });
});

// Update the user with the specific id
// TODO: restrict by self-user
router.put('/:user_id', (req, res) => {
  if(req.params.user_id === 'undefined') {
    return res.send({ message: 'User is undefined.' });
  }
  User.findById(req.params.user_id).then(user => {
    const {
      username = user.username,
      email = user.email,
      location = user.location,
      interests = user.interests,
      allowEmailNotifications = user.allowEmailNotifications,
      allowPushNotifications = user.allowPushNotifications
    } = req.body;

    user.username = username;
    user.email = email;
    user.location = location;
    user.interests = interests;
    user.allowEmailNotifications = allowEmailNotifications;
    user.allowPushNotifications = allowPushNotifications;

    user.save((saveErr, savedUser) => {
      if (saveErr) {
        res.send(saveErr);
      }
      // TODO: make consistent with SELECT data structure
      const {
        _id,
        username,
        firstName,
        lastName,
        email,
        location,
        interests,
        allowEmailNotifications,
        allowPushNotifications
      } = savedUser;
      const userData = {
        _id,
        username,
        firstName,
        lastName,
        email,
        location,
        interests,
        allowEmailNotifications,
        allowPushNotifications
      };

      res.json({ message: 'User updated!', user: userData });
    });
  })
  .catch(err => {
    return res.send(err);
  });
});

// Delete the user with the specific id
router.delete('/:user_id', adminRestricted, (req, res) => {
  User.remove({
    _id: req.params.user_id
  }, (err, user) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Successfully deleted', user });
  });
});

export default router;

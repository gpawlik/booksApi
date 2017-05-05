'use strict';

import bcrypt from 'bcrypt';

import User from '../src/models/user';
import Lefting from '../src/models/lefting';
import Book from '../src/models/book';

import { results as users } from './fixtures/Users.json';
import { results as leftings } from './fixtures/Leftings.json';
import { results as books } from './fixtures/Books.json';

const usersImport = () => {
  return users.reduce((memo, data) => {
    const {
      username,
      email,
      firstName,
      lastName,
      password,
      location,
      interests,
      isAdmin,
      allowEmailNotifications,
      allowPushNotifications,
      createdAt = Date.now(),
      updatedAt = Date.now()
    } = data;
    const newUser = new User({
      password: bcrypt.hashSync(password, 10),
      username,
      firstName,
      lastName,
      email,
      location,
      interests,
      isAdmin,
      allowEmailNotifications,
      allowPushNotifications,
      createdAt,
      updatedAt
    });

    return memo.then(() => {
      return newUser.save()
        .then(user => console.log('User created!', user.email))
        .catch(err => console.log('Error', err));
    });
  }, Promise.resolve());
};

const leftingsImport = () => {
  return leftings.reduce((memo, data) => {
    const { description, bookId, location, createdAt = Date.now(), updatedAt = Date.now() } = data;
    const newLefting = new Lefting({
      description,
      bookId,
      location,
      createdAt,
      updatedAt
    });

    return memo.then(() => {
      return newLefting.save()
        .then(event => console.log('Lefting created!', event.description))
        .catch(err => console.log('Error', err));
    });
  }, Promise.resolve());
};

const booksImport = () => {
  return books.reduce((memo, data) => {
    const { bookId, title, author, ISBN, pictureUrl, createdAt = Date.now(), updatedAt = Date.now() } = data;
    const newBook = new Book({
      bookId,
      title,
      author,
      ISBN,
      pictureUrl,
      createdAt,
      updatedAt
    });

    return memo.then(() => {
      return newBook.save()
        .then(book => console.log('Book created!', book.title))
        .catch(err => console.log('Error', err));
    });
  }, Promise.resolve());
};

exports.execute = () => {
  return leftingsImport()
    .then(() => {
      return usersImport();
    })
    .then(() => {
      return booksImport();
    });
};

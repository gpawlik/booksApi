'use strict';

import mongoose from 'mongoose';

const collections = [
  'leftings',
  'users',
  'books'
];

const deleteData = collection => {
  return new Promise(resolve => {
    mongoose.connection.db.dropCollection(collection)
      .then(() => {
        console.log('Collection dropped: ' + collection);
      })
      .catch(err => {
        console.log('Error dropping collection.', err);
      })
      .then(resolve);
  });
};

const dropCollections = () => {
  return collections.reduce((memo, collection) => {
    return memo.then(() => {
      return deleteData(collection);
    });
  }, Promise.resolve());
};

exports.execute = () => {
  return new Promise((resolve, reject) => {
    dropCollections()
      .then(() => {
        console.log('All collections processed...');
        resolve();
      })
      .catch(err => {
        console.log('Error processing collections...', err);
        reject();
      });
  });
};

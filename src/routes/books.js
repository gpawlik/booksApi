import express from 'express';
import Book from '../models/book';

const router = express.Router();

router.get('/', (req, res) => {
  Book
    .find()
    .limit(20)
    .sort({ createdAt: 1 })
    .exec(function (err, books) {
      if (err) res.send(err);
      res.json(books);
    });
});

router.get('/:bookId', function (req, res) {
  if(req.params.bookId === 'undefined') {
    res.status(404).json({ message: 'Wrong book Id provided.' });
  } else {
    Book.findById(req.params.bookId)
      .then(book => res.json(book))
      .catch(err => res.status(404).json({ message: 'Error occured:', err }));
  }
});

export default router;

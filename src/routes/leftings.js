import express from 'express';
import Lefting from '../models/lefting';
import Book from '../models/book';
import adminRestricted from '../middleware/adminRestricted';
import validateInput from '../shared/validations/lefting';

let router = express.Router();

// Create an lefting
router.post('/', function (req, res) {

  const { errors, isValid } = validateInput(req.body);

  if (isValid) {
    const { comment, bookId, userId, location, pictureUrl } = req.body;
    const newLefting = new Lefting({
      bookId,
      userId,
      comment,
      location,
      pictureUrl,
      createdAt: Date.now()
    });

    newLefting.save()
      .then(lefting => res.status(201).json({
        message: 'Lefting created!',
        lefting
      }))
      .catch(error => res.status(500).json({
        error
      }));
  } else {
    res.status(400).json(errors);
  }

});

router.get('/', (req, res) => {
  Lefting
    .find()
    .limit(20)
    .sort({ createdAt: 1 })
    .exec((err, leftings) => {
      if (err) {
        res.send(err);
      } else {
        res.json(leftings);
      }
    });
});

router.get('/wall', (req, res) => {
  let leftingsList;

  getLeftings()
    .then(leftings => {
      leftingsList = leftings;
      return leftings.map(item => {
        return item.bookId;
      });
    })
    .then(bookIds => {
      return getBooksByIds(bookIds);
    })
    .then(books => {
      return mergeLeftingsAndBooks(leftingsList, books);
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get('/:leftingId', function (req, res) {
  if(req.params.leftingId === 'undefined') {
    res.status(404).json({
      message: 'Wrong lefting Id provided.'
    });
  } else {
    let result;

    Lefting.findById(req.params.leftingId)
      .then(lefting => {
        result = lefting;
        return getBookById(lefting.bookId);
      })
      .then(book => {
        return res.json({
          _id: result._id,
          location: result.location,
          createdAt: result.createdAt,
          book
        });
      })
      .catch(error => res.status(404).json({
        message: 'Error occured:',
        error
      }));
  }
});

router.delete('/:leftingId', adminRestricted, function (req, res) {
  if(req.params.leftingId === 'undefined') {
    res.status(404).json({
      message: 'Wrong lefting Id provided.'
    });
  } else {
    Lefting.remove({ _id: req.params.leftingId })
      .then(() => res.json({
        message: 'Successfully deleted'
      }))
      .catch(error => res.status(404).json({
        message: 'Error occured:',
        error
      }));
  }
});

// Update the lefting with the specific id
// TODO: organize it more cleverly
router.put('/:lefting_id', adminRestricted, function (req, res) {
  const { description, bookId, location } = req.body;
  const { lefting_id } = req.params;

  Lefting
    .findById(lefting_id)
    .then(lefting => {
      lefting.description = description;
      lefting.bookId = bookId;
      lefting.location = location;
      lefting.save()
        .then(() => {
          res.json({
            message: 'Lefting updated!',
            lefting
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Database error:',
            error
          });
        });
    })
    .catch(err => {
      res.send(err);
    });
});

function getLeftings() {
  return Lefting
    .find()
    .limit(20)
    .sort({ createdAt: 1 })
    .exec();
}

function getBooksByIds(ids) {
  return Book
    .find({
      bookId: {
        $in: ids
      }
    })
    .limit(20)
    .exec((err, books) => {
      if (err) {
        return false;
      } else {
        return books;
      }
    });
}

function getBookById(id) {
  return Book
    .find({
      bookId: id
    })
    .limit(1)
    .exec()
    .then(books => {
      return books[0];
    })
    .catch(err => {
      return err;
    });
}

function mergeLeftingsAndBooks(leftings, books) {
  return leftings.map(lefting => {
    return {
      _id: lefting._id,
      pictureUrl: lefting.pictureUrl,
      location: lefting.location,
      createdAt: lefting.createdAt,
      book: books.find(item => item.bookId === lefting.bookId)
    };
  });
}

export default router;

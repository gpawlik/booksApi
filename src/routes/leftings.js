import express from 'express';
import Lefting from '../models/lefting';
import adminRestricted from '../middleware/adminRestricted';
import validateInput from '../shared/validations/lefting';

let router = express.Router();

// Create an lefting
router.post('/', adminRestricted, function (req, res) {

  const { errors, isValid } = validateInput(req.body);

  if (isValid) {
    const { description, bookId, location } = req.body;
    const newLefting = new Lefting({
      bookId,
      description,
      location,
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
      console.log('getting leftings...', err, leftings);
      if (err) res.send(err);
      res.json(leftings);
    });
});

router.get('/:leftingId', function (req, res) {
  if(req.params.leftingId === 'undefined') {
    res.status(404).json({
      message: 'Wrong lefting Id provided.'
    });
  } else {
    Lefting.findById(req.params.leftingId)
      .then(lefting => res.json(lefting))
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

export default router;

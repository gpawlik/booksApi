import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = ({ bookId, location }) => {
  let errors = {};

  if (Validator.isEmpty(bookId)) {
    errors.bookId = 'BookId is missing';
  }
  if (Validator.isEmpty(location)) {
    errors.location = 'Location is missing';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;

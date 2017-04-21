import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = ({ description, bookId, location }) => {
  let errors = {};

  if (Validator.isEmpty(description)) {
    errors.description = 'Enter a description';
  }
  if (Validator.isEmpty(bookId)) {
    errors.bookId = 'Enter a bookId';
  }
  if (Validator.isEmpty(location)) {
    errors.location = 'Enter a location';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;

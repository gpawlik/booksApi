import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = ({ location }) => {
  let errors = {};
  /*
  if (Validator.isEmpty(location)) {
    errors.location = 'Location is missing';
  }*/

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;

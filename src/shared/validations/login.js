//import validator from 'validator';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = data => {
  let errors = {};

  if (validator.isEmpty(data.identifier)) {
    errors.identifier = 'Enter an Identifier';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Enter a Password';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;

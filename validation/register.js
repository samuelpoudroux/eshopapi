// register.js

const Validator = require("validator");
const isEmpty = require("./empty.js");

const validateRegisterInput = async (data) => {
  let errors = {};
  const checkEmptyField = async () =>
    await Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (Validator.isEmpty(value)) {
          errors[`${key}`] = ` le champs ${key} est requis`;
        }
        return [key, value];
      })
    );

  await checkEmptyField();
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "Name must be between 2 to 30 chars";
  }

  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Name must be between 2 to 30 chars";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!Validator.isLength(data.password, { min: 3, max: 30 })) {
    errors.password = "Password must have 6 chars";
  }

  if (!Validator.isLength(data.repeat_password, { min: 3, max: 30 })) {
    errors.repeat_password = "adresse must have 6 chars";
  }
  if (!Validator.isLength(data.repeat_password, { min: 3, max: 30 })) {
    errors.repeat_password = "adresse must have 6 chars";
  }
  if (!Validator.isLength(data.billsAddress, { min: 3 })) {
    errors.billsAddress = "adresse de facturation must have 6 chars";
  }
  if (!Validator.isLength(data.dropAddress, { min: 3 })) {
    errors.dropAddress = "adresse de livraison must have 6 chars";
  }

  if (!Validator.equals(data.password, data.repeat_password)) {
    errors.repeat_password = "Password and Confirm Password must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = { validateRegisterInput };

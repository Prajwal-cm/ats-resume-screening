export const isEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!isRequired(email)) errors.email = 'Email is required';
  else if (!isEmail(email)) errors.email = 'Enter a valid email';
  if (!isRequired(password)) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Minimum 6 characters';
  return errors;
};

export const validateJob = ({ title, description }) => {
  const errors = {};
  if (!isRequired(title)) errors.title = 'Job title is required';
  if (!isRequired(description)) errors.description = 'Job description is required';
  else if (description.trim().length < 40)
    errors.description = 'Please provide a more detailed description';
  return errors;
};
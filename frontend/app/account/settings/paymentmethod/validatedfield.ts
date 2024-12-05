export const validateField = (
  name: string,
  value: string,
  errors: { [key: string]: string }, // Accept errors as a parameter
) => {
  const newErrors = { ...errors }; // Make a copy of current errors state
  switch (name) {
    case 'cardNumber':
      newErrors.cardNumber = /^\d{16}$/.test(value)
        ? ''
        : 'Invalid card number';
      break;
    case 'expirationDate':
      newErrors.expirationDate = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
        ? ''
        : 'Invalid expiration date';
      break;
    case 'cvv':
      newErrors.cvv = /^\d{3,4}$/.test(value) ? '' : 'Invalid CVV';
      break;
    case 'billingAddress':
      newErrors.billingAddress = value.trim() ? '' : 'Billing address required';
      break;
    case 'country':
      newErrors.country = value.trim() ? '' : 'Country required';
      break;
    default:
      break;
  }
  return newErrors; // Return the updated errors
};

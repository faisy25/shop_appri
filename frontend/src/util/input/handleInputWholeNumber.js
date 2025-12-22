const handleInputWholeNumber = (event) => {
  // Prevent the decimal point key (key = '.')
  if (event.key === '.') {
    event.preventDefault();
  }
  // Prevent the minus sign key (key = '-') for positive quantities
  if (event.key === '-') {
    event.preventDefault();
  }
};

export default handleInputWholeNumber;

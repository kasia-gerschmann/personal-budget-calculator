"use strict";

export const clearInputs = (...inputs) => {
  inputs.forEach((input) => (input.value = null));
};

export const sum = (arr) => {
  return arr.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
};

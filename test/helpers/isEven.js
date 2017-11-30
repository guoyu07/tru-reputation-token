'use strict';

export default function isEven(num) {
  var divisible = num % 2;
  if (divisible == 1) {
    return false;
  } else {
    return true;
  }
}
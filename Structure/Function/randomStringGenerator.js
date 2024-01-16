const RandExp = require('randexp')

async function randString(length, capital, number, specialChar) {
  length = !length ? 16 : length;
  cap = capital == true? 'A-Z' : null;
  num = number == true? '0-9' : null;
  sChar = specialChar == true ? '!@#$%^&*()_+-=?' : null;
  
  return new RandExp(`/^[a-z${cap}${num}${sChar}]{${length}}$/`)
}

module.exports = {randString}
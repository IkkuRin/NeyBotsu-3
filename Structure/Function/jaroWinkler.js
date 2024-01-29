function JaroWinklerDistance(str1, str2) {
  let m = 0;

  if (str1.length === 0 || str2.length === 0) {
    return 0;
  }
  if (str1 === str2) {
    return 1;
  }

  let distance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1,
    str1Matches = new Array(str1.length),
    str2Matches = new Array(str2.length);

  for (i = 0; i < str1.length; i++) {
    let low = i >= distance ? i - distance : 0,
      high = i + distance <= str2.length ? i + distance : str2.length - 1;

    for (j = low; j <= high; j++) {
      if (
        str1Matches[i] !== true &&
        str2Matches[j] !== true &&
        str1[i] === str2[j]
      ) {
        m++;
        str1Matches[i] = str2Matches[j] = true;
        break;
      }
    }
  }

  if (m === 0) {
    return 0;
  }

  let k = (n_trans = 0);

  for (i = 0; i < str1.length; i++) {
    if (str1Matches[i] === true) {
      for (j = k; j < str2.length; j++) {
        if (str2Matches[j] === true) {
          k = j + 1;
          break;
        }
      }

      if (str1[i] !== str2[j]) {
        ++n_trans;
      }
    }
  }

  let strength =
      (m / str1.length + m / str2.length + (m - n_trans / 2) / m) / 3,
    l = 0,
    p = 0.1;

  if (strength > 0.7) {
    while (str1[l] === str2[l] && l < 4) {
      l++;
    }
    strength = strength + l * p * (1 - strength);
  }
  return strength;
}

module.exports = JaroWinklerDistance;

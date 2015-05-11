import konfig from 'konfig';

export default class Rune {
  get config() {
    return this.$config || (this.$config = konfig());
  }

  try(fn, ...rest) {
    try {
      return fn(...rest);
    } catch(e) {}
  }
}
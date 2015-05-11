export default class Exception extends Error {
  constructor(...args) {
    super(...args);
    this.$value = args ? args[0] : null;
  }

  get value() {
    return this.$value;
  }
}
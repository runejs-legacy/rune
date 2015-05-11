export default class Type {
  constructor(field, value) {
    this.field = field;
    this.value = value;
    this.dbValue = value;

    if (this.value === undefined) {
      this.value = null;
      this.dbValue = null;
    }

    if (this.value !== null) {
      this.parse();
    }
  }

  parse() {
    // Do nothing
  }
}
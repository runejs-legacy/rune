import Validator from './validator';

export default class MinValidator extends Validator {
  validate() {
    if (this.value && this.value < this.rule) {
      this.model.errors.add(this.field, `cannot be less than ${this.rule}`);
    }
  }
}
import Validator from './validator';

export default class MaxValidator extends Validator {
  validate() {
    if (this.value && this.value > this.rule) {
      this.model.errors.add(this.field, `cannot be greater than ${this.rule}`);
    }
  }
}
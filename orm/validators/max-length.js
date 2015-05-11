import Validator from './validator';

export default class MaxLengthValidator extends Validator {
  validate() {
    if (this.value && this.value.length > this.rule) {
      this.model.errors.add(this.field, 'is too long');
    }
  }
}
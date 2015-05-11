import Validator from './validator';

export default class RequiredValidator extends Validator {
  validate() {
    if (this.value === null || this.value === undefined) {
      this.model.errors.add(this.field, 'is required');
    }
  }
}
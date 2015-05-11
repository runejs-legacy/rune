import Type from './type';

export default class BooleanType extends Type {
  parse() {
    if (this.value !== null && this.value !== undefined) {
      if (this.value === 'false') {
        this.value = false;
      } else {
        this.value = !!this.value;
      }

      this.dbValue = this.value;
    }
  }
}
import Type from './type';

export default class NumberType extends Type {
  parse() {
    this.value = parseFloat(this.value) || 0
    this.dbValue = this.value;
  }
}
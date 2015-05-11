import Type from './type';

export default class StringType extends Type {
  parse() {
    this.dbValue = this.value ? this.value.toString() : null;
  }
}
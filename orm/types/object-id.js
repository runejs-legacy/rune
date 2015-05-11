import Type from './type';
import mongodb from 'mongodb';
import { InvalidValue } from '../exceptions';

export default class ObjectIDType extends Type {
  parse() {
    try {
      if (this.value) {
        this.value = this.value.toString();
        this.dbValue = mongodb.ObjectID(this.value);
      } else {
        this.value = null;
        this.dbValue = null;
      }
    } catch(e) {
      throw new InvalidValue(this.field + ' not valid');
    }
  }
}
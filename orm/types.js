import _ from 'lodash';
import * as types from './types/';

export default class Types {
  static registerType(klass) {
    let name = klass.name.replace('Type', '');
    this.types[name] = klass;
  }
}

Types.types = {};

_.each(types, (type) => Types.registerType(type));
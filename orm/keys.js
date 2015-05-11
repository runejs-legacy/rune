import _ from 'lodash';
import changeCase from 'change-case';
import * as exceptions from './exceptions';
import Type from './types/type';

export default class Keys {
  static get keys() {
    if (!this.$keys) {
      this.$keys = {};
      this.$addType('_id', this.types.ObjectID);
    }

    return this.$keys;
  }

  static $addType(name, type) {
    this.keys[name] = type;

    if (this.types[type.name.replace('Type', '')]  !== type) {
      this.keys[name] = this.types[type.name];
    }
  }

  get dbAttributes() {
    let attrs = {};
    _.each(this.constructor.keys, (type, key) => {
      attrs[key] = new type(key, this[key]).dbValue;
    });
    return attrs;
  }

  get attributes() {
    let attrs = {};
    _.each(this.constructor.keys, (_, key) => {
      attrs[key] = this[key];
    });
    return attrs;
  }

  set attributes(attrs) {
    _.each(this.constructor.keys, (_, key) => {
      return this[key] = attrs[key] || null
    });
  }

  set(key, value) {
    if (!key) return;
    let attrs;

    if (_.isString(key)) {
      attrs = {};
      attrs[key] = val;
    } else {
      attrs = key;
    }

    _.each(attrs, (val, key) => {
      if (_.has(this.constructor.keys, key)) {
        this[key] = new this.constructor.keys[key](key, val).value;
      }
    });
  }

  static registerType(klass) {
    let name = klass.name.replace('Type', '');
    this.types[name] = klass;
  }
}
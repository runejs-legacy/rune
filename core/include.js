import _ from 'lodash';

const DEFAULT_PROPERTIES = [
  'length', 'name', 'arguments', 'caller', 'prototype'
]

const define = (target, props) => {
  for (let key in props) {
    let prop = props[key];
    prop.configurable = true;
    if (prop.value) prop.writable = true;
  }

  Object.defineProperties(target, props);
}

const include = (klass) => {
  return (base) => {
    let instanceMethods = Object.getOwnPropertyDescriptors(klass.prototype);
    let classMethods = Object.getOwnPropertyDescriptors(klass);

    base.$initializers = base.$initializers || [];

    if (instanceMethods.$initialize) {
      base.$initializers.push(instanceMethods.$initialize.value);
    }

    instanceMethods.$initialize = {
      value: function(...args) {
        base.$initializers.forEach(fn => fn.call(this, ...args));
      }
    };

    define(base.prototype, _.omit(instanceMethods, 'constructor'));
    define(base, _.omit(classMethods, ...DEFAULT_PROPERTIES));

    if (classMethods.$included) {
      base.$included();
      delete(base.$included);
    }
  }
}

export { include };
import _ from 'lodash';

export default class Hooks {
  static get before() {
    if (!this.$before) this.$before = { save: [], create: [], update: [], validation: [] };
    return this.$before;
  }

  static $addBefore(type, method) {
    this.before[type].push(method);
  }

  static get after() {
    if (!this.$after) this.$after = { save: [], create: [], update: [], validation: [] };
    return this.$after;
  }

  static $addAfter(type, method) {
    this.after[type].push(method);
  }

  async trigger(type, action) {
    for(let cb of this.constructor[type][action]) {
      if (_.isFunction(cb)) {
        cb.bind(this);
        await cb(this);
      } else {
        await this[cb]();
      }
    }
  }
}
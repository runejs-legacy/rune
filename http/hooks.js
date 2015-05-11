import _ from 'lodash';

const DEFAULT_HOOK = {
  before: { action: [] },
  after: { action: [] }
};

const filter = (variable, type, method, options = { except: [] }) => {
  return (klass) => {
    klass.hooks = _.cloneDeep(klass.hooks || DEFAULT_HOOK);
    let target = klass.hooks[variable][type];
    _.remove(target, { method: method });
    target.push({ method: method, options: options });
  }
}

const unfilter = (variable, type, method, options = { except: [] }) => {
  return (klass) => {
    klass.hooks = _.cloneDeep(klass.hooks || DEFAULT_HOOK);
    let target = klass.hooks[variable][type];
    let filter = _.find(target, { method: method });

    if (options.only && filter.only) {
      _.remove(filter.only, (i) => _.includes(options.only, i));
    } else if (options.only) {
      options.only.forEach((i) => {
        if(!_.includes(filter.except, i)) {
          filter.except.push(i);
        }
      });
    } else if (filter.only) {
      _.remove(filter.only, (i) => !_.includes(options.except, i));
    } else {
      filter.only = options.except.filter((i) => !_.includes(filter.except, i));
      delete(filter.except);
    }
  }
}

export default {
  before: (...args) => filter('before', ...args),
  after: (...args) => filter('after', ...args),
  skipBefore: (...args) => unfilter('before', ...args),
  skipAfter: (...args) => unfilter('after', ...args)
}
const type = (type) => {
  return (instance, name, descriptor) => {
    let initializer = descriptor.initializer;

    descriptor.get = function() {
      if ((this['$$' + name] === null || this['$$' + name] === undefined) && initializer) {
        return initializer();
      } else if (this['$$' + name] !== undefined) {
        return this['$$' + name];
      } else {
        return null;
      }
    }

    descriptor.set = function(val) { this['$$' + name] = val; };

    delete(descriptor.initializer);
    delete(descriptor.writable);

    instance.constructor.$addType(name, type);
    return descriptor;
  }
}

const before = (type) => {
  return (instance, method) => {
    instance.constructor.$addBefore(type, method);
  }
}

const after = (type) => {
  return (instance, method) => {
    instance.constructor.$addAfter(type, method);
  }
}

const Timestamps = (klass) => {
  Timestamps.created(klass);
  Timestamps.updated(klass);
  return klass;
}

Timestamps.created = (klass) => {
  klass.$addType('createdAt', Date);
  klass.$addBefore('create', (doc) => doc.createdAt = new Date());
  return klass;
}

Timestamps.updated = (klass) => {
  klass.$addType('updatedAt', Date);
  klass.$addBefore('save', (doc) => doc.updatedAt = new Date());
  return klass;
}

const required = (instance, name) => {
  instance.constructor.$addValidation(name, 'required', true);
}

const maxLength = (rule) => {
  return (instance, name) => {
    instance.constructor.$addValidation(name, 'maxLength', rule);
  }
}

const max = (rule) => {
  return (instance, name) => {
    instance.constructor.$addValidation(name, 'max', rule);
  }
}

const min = (rule) => {
  return (instance, name) => {
    instance.constructor.$addValidation(name, 'min', rule);
  }
}

export { type, before, after, Timestamps, required, maxLength, max, min };
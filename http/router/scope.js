import _ from 'lodash';
import $path from 'path';
import lingo from 'lingo';
import changeCase from 'change-case';

export default class Scope {
  constructor(parent, path, set, privatePath, controller) {
    this.parent = parent;
    this.path = path;
    this.privatePath = privatePath || path;
    this.controller = controller;
    this.set = set;
    this.$defineHttpMethods();
    this.afterFinalize = [];
  }

  $matchArgs(path, target, options = {}) {
    if (_.isString(target)) {
      [options.controller, options.action] = target.split('#');
    } else if (target) {
      options = target;
    }

    if (!options.controller) {
      options.controller = this.controller;
    }

    if (!options.action) {
      options.action = path;
    }

    if (!options.methods) {
      options.methods = options.method ? [options.method] : ['get', 'post', 'put', 'patch', 'delete'];
    }

    return [path, target, options];
  }

  match(...args) {
    let [path, target, options] = this.$matchArgs(...args);

    options.methods.forEach(method => {
      this.afterFinalize.push(() => {
        this.set.register($path.join(this.privatePath, path), method, options);
      });
    });
  }

  to(target, options) {
    this.match('', target, options);
  }

  $defineHttpMethods() {
    ['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
      this[method] = (...args) => {
        let [path, target, options] = this.$matchArgs(...args);
        options.methods = [method];
        this.match(path, target, options);
      }
    });
  }

  $defineResource(name, options, fn, klass) {
    let controller;

    if (_.isFunction(options)) {
      fn = options;
      controller = name;
    } else {
      controller = options ? options.controller || name : name;
    }

    this.afterFinalize.push(() => {
      let path = $path.join(this.path, name);
      let resource = new klass(this, name, controller, path, this.set);
      if (fn) fn(resource);
      resource.finalize();
    });
  }

  resources(name, options, fn) {
    this.$defineResource(name, options, fn, MultipleResource);
  }

  resource(name, options, fn) {
    this.$defineResource(name, options, fn, SingletonResource);
  }

  finalize() {
    this.afterFinalize.forEach(fn => fn.call(this));
  }
}

class Resource extends Scope {
  constructor(parent, name, controller, path, set, privatePath) {
    super(parent, path, set, privatePath, controller);
    this.name = name;
    this.controller = controller;
    this.$configure();
  }
}

class MultipleResource extends Resource {
  constructor(...args) {
    super(...args);
    this.$remapHttpMethods();
  }

  $configure() {
    this.collection.afterFinalize = this.member.afterFinalize;
    this.collection.get('/', { controller: this.controller, action: 'index' });
    this.collection.post('/', { controller: this.controller, action: 'create' });
    this.member.get('/', { controller: this.controller, action: 'show' });
    this.member.put('/', { controller: this.controller, action: 'update' });
    this.member.delete('/', { controller: this.controller, action: 'destroy' });
  }

  get collection() {
    if (!this.$collection) {
      this.$collection = new Scope(this, this.path, this.set, this.path, this.controller);
    }

    return this.$collection;
  }

  get member() {
    if (!this.$member) {
      this.$member = new Scope(
        this,
        this.path + '/:' + this.idParam,
        this.set,
        this.path + '/:id',
        this.controller
      );
    }

    return this.$member;
  }

  $remapHttpMethods() {
    ['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
      this[method] = this.member[method];
    });
  }

  get idParam() {
    return lingo.en.singularize(changeCase.camelCase(this.name)) + 'Id';
  }

  finalize() {
    super.finalize();
    this.collection.finalize();
  }
}

class SingletonResource extends Resource {
  $configure() {
    this.get('/', { controller: this.controller, action: 'show' });
    this.post('/', { controller: this.controller, action: 'create' });
    this.put('/', { controller: this.controller, action: 'update' });
    this.delete('/', { controller: this.controller, action: 'destroy' });
  }
}
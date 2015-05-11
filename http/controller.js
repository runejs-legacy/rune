import _ from 'lodash';

export class Controller {
  constructor(route, request, response) {
    this.$route = route;
    this.$request = request;
    this.$response = response;
    this.$response.headers = {};
    this.$params = _.merge(request.params, request.body, request.query);
  }

  async $call() {
    await this.$beforeAction();
    if (this.$replied) return;
    await this[this.$action]();
    await this.$beforeAction();
  }

  async $reply(content, status = 200) {
    this.$replied = true;

    _.each(this.$response.headers, (val, key) => this.$response.set(key, val));

    let json;

    if (_.isArray(content)) {
      json = await* content.map(async (item) => item.toJson ? await item.toJson() : item);
    } else {
      json = content && content.toJson ? await content.toJson() : content;
    }

    this.$response.status(status).json(json);
  }

  async $reject(error, status = 500) {
    this.$replied = true;
    this.$response.status(status).json(error);
  }

  $break() {
    this.$broken = true;
  }

  get $hooks() {
    let result = _.cloneDeep(this.constructor.hooks);

    ['before', 'after'].forEach(hook => {
      ['action'].forEach(type => {
        _.remove(result[hook][type], item => {
          if (item.options.only) {
            return !_.includes(item.options.only, this.$action);
          } else {
            return _.includes(item.options.except, this.$action);
          }
        });
      });
    });

    return result;
  }

  async $beforeAction(action) {
    for (let hook of this.$hooks.before.action)
      if(!this.$replied) await this[hook.method]();
  }

  async $afterAction(action) {
    if (!this.$replied) this.$reply({});

    for (let hook of this.$hooks.after.action)
      if(!this.$broken) await this[hook.method]();
  }

  static catch(klass, method) {
    this.catchers = this.catchers || {};
    this.catchers[klass] = method;
  }

  $catch(error) {
    if (this.constructor.catchers[error.constructor.name]) {
      let method = this.constructor.catchers[error.constructor.name];
      this['$' + method](error);
    } else {
      this.$reject(error.value || error.stack, error.code || 500)
    }
  }
}

Controller.catchers = {};
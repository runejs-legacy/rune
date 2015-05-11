import _ from 'lodash';
import * as validators from './validators';
import changeCase from 'change-case';

export default class Validations {
  static get validations() {
    if (!this.$validations) {
      this.$validations = {};
    }

    return this.$validations;
  }

  static $addValidation(key, validator, options) {
    this.validations[key] = this.validations[key] || {};
    this.validations[key][validator] = options;
  }

  static registerValidator(klass) {
    let name = changeCase.camelCase(klass.name.replace('Validator', ''));
    this.$validators[name] = klass;
  }

  get errors() {
    let model = this;

    return {
      add(field, message) {
        (model.$errors[field] = model.$errors[field] || []).push(message);
      },

      async list() {
        await model.$validate();
        return model.$errors;
      }
    }
  }

  async $validate() {
    await this.trigger('before', 'validation');

    this.$errors = {};
    for(let key in this.constructor.validations) {
      let validations = this.constructor.validations[key];
      for(let validator in validations) {
        let rule = validations[validator];
        await new Validations.$validators[validator](this, key, this[key], rule).validate();
      }
    }

    await this.trigger('after', 'validation');
  }

  async valid() {
    return _.isEmpty(await this.errors.list());
  }
}

Validations.$validators = {};
_.each(validators, (validator) => Validations.registerValidator(validator));
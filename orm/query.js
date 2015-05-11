import _ from 'lodash';
import Client from './client';
import ModelArray from './model-array';
import mongodb from 'mongodb';
import * as exceptions from './exceptions';

export default class Query {
  constructor(model) {
    this.Model = model;
    this.$query = {};
    this.$limit = null;
    this.$skip = null;
    this.$fields = {};
  }

  where(options) {
    _.extend(this.$query, this.injectFields(options));
    return this;
  }

  limit(count) {
    this.$limit = count;
    return this;
  }

  skip(count) {
    this.$skip = count;
    return this;
  }

  async fetch() {
    let results = await Client.find(this.Model.collection, this.$query, this.$fields, this.$limit, this.$skip);
    return new ModelArray(results.map((doc) => new this.Model(doc)));
  }

  async first() {
    this.$limit = 1;
    let results = await this.fetch();
    return results.length ? results[0] : null;
  }

  async count() {
    let result = await Client.count(this.Model.collection, this.$query);
    return result;
  }

  async find(id) {
    let result = await this.where({ _id: id }).first();

    if (result) {
      return result;
    } else {
      throw new exceptions.DocumentNotFound(this.Model.name + ' not found');
    }
  }

  async findBy(...args) {
    let result = await this.where(...args).first();

    if (result) {
      return result;
    } else {
      throw new exceptions.DocumentNotFound(this.Model.name + ' not found');
    }
  }

  injectFields(options) {
    _.each(options, (val, key) => {
      if (_.isObject(val)) {
        options[key] = this.injectFields(val);
      } else if (this.Model.keys[key]) {
        options[key] = new this.Model.keys[key](key, val).dbValue;
      }
    });

    return options;
  }
}
import _ from 'lodash';
import changeCase from 'change-case';
import Query from './query';
import lingo from 'lingo';
import Client from './client';
import * as exceptions from './exceptions';
import { include } from '../core';
import Keys from './keys';
import Hooks from './hooks';
import Types from './types';
import Validations from './validations';

@include(Keys)
@include(Hooks)
@include(Types)
@include(Validations)
export class Base {
  $attributes = {};
  $errors = {};

  constructor(attrs) {
    Object.observe(this, changes => {
      changes.forEach(change => {
        if (this.constructor.keys[change.name]) {
          this.set(change.name, change.object[change.name]);
        }
      });
    });

    this.set(attrs);
  }

  static get after() {
    return this.$after || {};
  }

  static set after(val) {
    this.$after = val;
  }

  static registerValidator(klass) {
    let name = changeCase.camelCase(klass.name.replace('Validator', ''));
    Base.$validators[name] = klass;
  }

  static async create(attrs) {
    let doc = new this(attrs);
    await doc.save();
    return doc;
  }

  static get collection() {
    return this.$collection || (this.$collection = lingo.en.pluralize(changeCase.camelCase(this.name)));
  }

  get id() { return this._id }

  async save() {
    if(!await this.valid()) {
      throw new exceptions.DocumentNotValid(this.$errors);
    }

    await this.trigger('before', 'save');

    if (this.id) {
      await this.trigger('before', 'update');
      let result = await Client.update(this.constructor.collection, { _id: this.dbAttributes._id }, this.dbAttributes);
      await this.trigger('after', 'update');
    } else {
      await this.trigger('before', 'create');
      let result = await Client.insert(this.constructor.collection, this.dbAttributes);
      this.set(result[0]);
      await this.trigger('after', 'create');
    }

    await this.trigger('after', 'save');
  }

  async destroy() {
    await Client.remove(this.constructor.collection, { _id: this.dbAttributes._id });
  }

  async toJson() {
    return this.attributes;
  }

  async reload() {
    let doc = await this.constructor.find(this.id);
    this.set(doc.attributes);
    return this;
  }

  static where(...args) { return new Query(this).where(...args); }
  static limit(count) { return new Query(this).limit(count); }
  static skip(count) { return new Query(this).skip(count); }
  static async fetch() { return new Query(this).fetch(); }
  static async count() { return new Query(this).count(); }
  static async first() { return new Query(this).first(); }
  static async find(id) { return new Query(this).find(id); }
  static async findBy(...args) {
    let query = new Query(this);
    return query.findBy(...args);
  }

  static async findOrInitializeBy(...args) {
    try {
      return await this.findBy(...args);
    } catch(e) {
      return new this(...args);
    }
  }
}
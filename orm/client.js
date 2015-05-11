import { MongoClient } from 'mongodb';

export default class Client {
  static async connect(url) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, db) => {
        if(err) return reject(err);
        this.$db = db;
        resolve(db);
      });
    });
  }

  static async find(collection, query, fields, limit, skip) {
    return new Promise((resolve, reject) => {
      let call = this.$db.collection(collection).find(query, fields);
      if (limit) {
        call = call.limit(limit);
      }

      if (skip) {
        call = call.skip(skip);
      }

      call.toArray((err, docs) => {
        err ? reject(err) : resolve(docs);
      });
    });
  }

  static async count(collection, query) {
    return new Promise((resolve, reject) => {
      this.$db.collection(collection).count(query, (err, count) => {
        err ? reject(err) : resolve(count);
      });
    });
  }

  static async remove(collection, ...args) {
    return new Promise((resolve, reject) => {
      this.$db.collection(collection).remove(...args, (err, count) => {
        err ? reject(err) : resolve(count);
      });
    });
  }

  static async insert(collection, ...args) {
    return new Promise((resolve, reject) => {
      this.$db.collection(collection).insert(...args, (err, docs) => {
        err ? reject(err) : resolve(docs);
      });
    });
  }

  static async update(collection, ...args) {
    return new Promise((resolve, reject) => {
      this.$db.collection(collection).update(...args, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  static async drop() {
    return new Promise((resolve, reject) => {
      this.$db.dropDatabase((err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
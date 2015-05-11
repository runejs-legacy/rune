import Client from './client';
import { Document } from './document';
import * as exceptions from './exceptions';
import _ from 'lodash';

export default (magician) => {
  magician.on('after:init', () => {
    Rune.Document = Document;
    _.each(exceptions, (val, key) => Rune[key] = val);
    magician.loader.loadPath(magician.path + '/models');

    Client
      .connect(Rune.config.mongo.uri)
      .catch((err) => console.log(err.toString()));
  });
}
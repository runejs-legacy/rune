import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export default class Loader {
  static loadPath(dir) {
    if (!fs.existsSync(dir)) return;

    let baseFile = path.join(dir, 'base.js');
    if (fs.existsSync(baseFile)) {
      this.loadModule(baseFile);
    }

    let files = _.without(fs.readdirSync(dir), 'base.js');
    files.forEach(file => this.loadModule(path.join(dir, file)));
  }

  static loadModule(dir) {
    _.each(require(dir), (val, key) => global[key] = val);
  }
}
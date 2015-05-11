import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';

export default class RouteSet {
  constructor() {
    this.routes = [];
  }

  register(path, method, options) {
    let keys = [];
    let regexp = pathToRegexp(path, keys);
    _.extend(options, { path: path, method: method, regexp: regexp, keys: keys });
    this.routes.push(_.omit(options, 'methods'));
  }
}
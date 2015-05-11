import RouteSet from './router/set';
import Scope from './router/scope';
import pathToRegexp from 'path-to-regexp';
import changeCase from 'change-case';
import _ from 'lodash';

export default class Router {
  constructor() {
    this.routes = [];
    let routesModule = require(process.cwd() + '/config/routes');
    this.routeSet = new RouteSet();
    let rootScope = new Scope(null, '/', this.routeSet);
    routesModule(rootScope);
    rootScope.finalize();
    this.routeSet.routes.reverse();
  }

  async resolve(request, response) {
    let path = request.url.replace(/\?.*/, '');

    let route = _.find(this.routeSet.routes, (route) => {
      if (request.method.toLowerCase() != route.method) return;
      let result = route.regexp.exec(path);

      if (result) {
        route.params = {};
        route.keys.forEach((key, i) => {
          route.params[key.name] = result[i + 1];
        });

        return true;
      }
    });

    if (route) {
      request.params = route.params;
      let controller = new global[changeCase.pascalCase(route.controller) + 'Controller'](route, request, response);
      controller.$action = route.action;
      try {
        await controller.$call();
      } catch (err) {
        controller.$catch(err);
      }
    } else {
      response.status(404).json({});
    }
  }
}
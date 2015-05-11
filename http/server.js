import express from 'express';
import bodyParser from 'body-parser';
import Router from './router';

export default class Server {
  constructor(port) {
    this._port = port;
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.all('*', (req, res) => this.handle(req, res));
    this.router = new Router();
  }

  handle(request, response) {
    this.router.resolve(request, response);
  }

  async start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(this.port, () => resolve());
    });
  }

  get host() {
    return this._server.address().address;
  }

  get port() {
    return this._server ? this._server.address().port : this._port;
  }

  static async run(port) {
    this.server = new Server(port);
    await this.server.start();
    console.log(`Rune Server started at http://${this.server.host}:${this.server.port}`);
  }

  async close() {
    await this._server.close();
  }
}
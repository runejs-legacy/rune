import Exception from '../../core/exception';

export default class DocumentNotFound extends Exception {
  get code() { return 404; }
}
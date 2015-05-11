import Exception from '../../core/exception';

export default class InvalidValue extends Exception {
  get code() { return 422; }
}
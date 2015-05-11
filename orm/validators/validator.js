export default class Validator {
  constructor(model, field, value, rule) {
    this.model = model;
    this.field = field;
    this.value = value;
    this.rule = rule;
  }
}
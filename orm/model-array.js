export default class ModelArray {
  constructor(array) {
    array.toJson = this.toJson;
    return array;
  }

  async toJson(...args) {
    return await* this.map(await async (model) => model.toJson(...args));
  }
}
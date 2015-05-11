import fs from 'fs';
import ModuleLoader from './loader';

export default class Magician {
  constructor(path) {
    this.path = path;
    this.$events = {};
    this.$tasks = {};
    this.loader = ModuleLoader;
  }

  on(event, fn) {
    (this.$events[event] = this.$events[event] || []).push(fn);
  }

  registerTask(name, fn) {
    this.$tasks[name] = fn;
  }

  async init() {
    this.loadSpells();
    await this.trigger('before:all');
    await this.trigger('after:init');
  }

  async run(task, options) {
    if (!this.$tasks[task]) {
      let errorMessage = `There is no task named '${task}'.\n`;
      errorMessage += `Use 'rune help' command to show all tasks.`;
      throw new Error(errorMessage);
    }

    await this.$tasks[task](options);
  }

  async trigger(event) {
    for(let fn of (this.$events[event] || [])) {
      await fn();
    }
  }

  loadSpells() {
    let spellFiles = [__dirname + '/spell.js'];
    let modulesPath = this.path + '/node_modules';
    let modules = fs.existsSync(modulesPath) ? fs.readdirSync(modulesPath) : [];

    modules.forEach((module) => {
      let spellFile = this.path + '/node_modules/' + module + '/spell.js';
      if (fs.existsSync(spellFile)) {
        spellFiles.push(spellFile);
      }
    });

    spellFiles.forEach((file) => require(file)(this));
  }

  finish() {
    process.exit(0);
  }
}
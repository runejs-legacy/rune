import Magician from './magician';
import yargs from 'yargs';
import _ from 'lodash';
import konfig from 'konfig';
import { Rune } from '../core';

global.Rune = new Rune();

let task = yargs.argv._[0] || 'help';
let options = _.omit(yargs.argv, '$0');
options._.splice(0, 1);

let magician = new Magician(process.cwd());

magician.init().then(async () => {
    try {
      await magician.run(task, options);
    } catch(e) {
      console.log(e.stack);
    }
}).catch(err => console.log(err.stack));
import chai from 'chai';
import lodash from 'lodash';
import Client from '../orm/client';

global.expect = chai.expect;
global._ = lodash;

before(async () =>
  await Client
    .connect('mongodb://localhost/rune_test')
    .catch((err) => console.log(err.toString()))
)


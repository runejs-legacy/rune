import httpSpell from './http/spell';
import ormSpell from './orm/spell';
import execSpell from './exec/spell';

export default (magician) => {
  ormSpell(magician);
  httpSpell(magician);
  execSpell(magician);
}
import { Document } from '../../orm';
import { DocumentNotFound } from '../../orm/exceptions';

describe('Actions', () => {
  let Document1;

  before(() => {
    class TheDocument1 extends Document {

    }

    Document1 = TheDocument1;
  });

  it('deletes correctly', async () => {
    let instance = await Document1.create();
    expect(instance.id.constructor).to.eq(String);
    let instance2 = await Document1.find(instance.id);
    expect(instance.id).to.eq(instance2.id);
    await instance2.destroy();

    try {
      await Document1.find(instance.id);
      expect(1).to.eq(2); // must throw error
    } catch(e) {
      expect(e.constructor).to.eq(DocumentNotFound)
    }
  });
});
import { Document } from '../../orm/document';
import { type, required } from '../../orm/decorators';

describe('Keys', () => {
  let Document1;
  let Document2;

  before(() => {
    class TheDocument1 extends Document {
      @type(String)
      key1 = 'the val';

      @type(Array)
      key2 = [];
    }

    class TheDocument2 extends Document {
      @type(Number)
      @required
      key1;
    }

    Document1 = TheDocument1;
    Document2 = TheDocument2;
  })

  it('has _id key', () => {
    expect(Document1.keys._id).to.eq(Document.types.ObjectID);
  });

  it('has correct keys', () => {
    expect(Document1.keys.key1).to.eq(Document.types.String);
    expect(Document2.keys.key1).to.eq(Document.types.Number);
  });

  it('has correct defaults', () => {
    let instance1 = new Document1({ key2: [1,2] });
    let instance2 = new Document1();

    expect(instance1.key1).to.eql('the val');
    expect(instance2.key1).to.eql('the val');
    expect(instance1.key2).to.eql([1, 2]);
    expect(instance2.key2).to.eql([]);
  });

  it('has correct defaults', () => {
    let instance1 = new Document1();
    let instance2 = new Document2();

    expect(instance1.key1).to.eq('the val');
    expect(instance2.key1).to.eq(null);
  });

  it('has correct validation', async () => {
    let instance1 = new Document1();
    let instance2 = new Document2();
    expect(await instance1.valid()).to.eq(true);
    expect(await instance2.valid()).to.eq(false);
  });
});
import * as orm from '../../orm';

describe('Hooks', () => {
  let Document1;
  let Document2;

  before(() => {
    @orm.Timestamps
    class TheDocument1 extends orm.Document {
      @orm.type(String)
      name = 'the name';

      @orm.type(Number)
      @orm.required
      nameLength;

      @orm.before('validation')
      setLength() {
        this.nameLength = this.name.length;
      }
    }

    class TheDocument2 extends orm.Document {
      @orm.type(Number)
      number = 5;

      @orm.type(Number)
      @orm.required
      double;

      @orm.before('validation')
      multiply() {
        this.double = this.number * 2;
      }
    }

    Document1 = TheDocument1;
    Document2 = TheDocument2;
  })

  it('has correct before validation hook', async () => {
    let instance1 = new Document1();
    let instance2 = new Document2();

    expect(instance1.nameLength).to.eq(null);
    expect(instance2.double).to.eq(null);
    expect(await instance1.valid()).to.eq(true);
    expect(await instance2.valid()).to.eq(true);
    expect(instance1.nameLength).to.eq(8);
    expect(instance2.double).to.eq(10);
  });

  it('has correct timestamps', async () => {
    let instance = new Document1();
    await instance.save();
    expect(instance.createdAt).to.not.eq(null);
    expect(instance.updatedAt).to.not.eq(null);

    let created = instance.createdAt;
    let updated = instance.updatedAt;
    await instance.save();
    expect(instance.createdAt).to.eq(created);
    expect(instance.updatedAt).to.not.eq(updated);
  });
});
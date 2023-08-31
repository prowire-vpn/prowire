import {Base} from './base.entity';

class TestEntity extends Base {
  constructor(public name: string, public age: number, id?: string) {
    super({id});
    this.age = age + 1;
    this.initialized = true;
  }
}

describe('Base', () => {
  describe('changedProperties', () => {
    it('should keep track of changed properties after te entity was initialized', () => {
      const test = new TestEntity('John', 18);
      test.name = 'Jane';
      test.age = 22;

      expect(test.changedProperties.size).toBe(2);
      expect(test.changedProperties.has('name')).toBe(true);
      expect(test.changedProperties.has('age')).toBe(true);
    });

    it('should not keep track of changes made during the entity construction', () => {
      const test = new TestEntity('John', 20);

      expect(test.changedProperties.size).toBe(0);
    });
  });

  describe('newEntity', () => {
    it('should consider entities without ID at construction to be new entities', () => {
      const test = new TestEntity('John', 18);

      expect(test.newEntity).toBe(true);
    });

    it('should consider entities with an ID at construction to be new entities', () => {
      const test = new TestEntity('Jon', 18, 'id_123');

      expect(test.newEntity).toBe(false);
    });
  });
});

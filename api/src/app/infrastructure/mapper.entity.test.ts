import {Base} from 'app/domain';
import {BaseSchema} from './base.schema';
import {Mapper} from './mapper.entity';

class Child extends Base {
  constructor(public name: string) {
    super();
    this.initialized = true;
  }
}

export class ChildSchema extends BaseSchema<Child> {
  constructor(public surname: string) {
    super();
  }
}

class Parent extends Base {
  constructor(
    public name: string,
    id?: string,
    public child?: Child,
    public children?: Child[],
    public address?: string,
  ) {
    super({id});
    this.initialized = true;
  }
}

export class ParentSchema extends BaseSchema<Parent> {
  constructor(
    public fullName: string,
    public kid?: ChildSchema,
    public family?: ChildSchema[],
    public address?: string,
  ) {
    super();
  }
}

describe('Mapper', () => {
  describe('Basic mapping', () => {
    it('should map from domain without transformation when provided a string', () => {
      const mapper = new Mapper<Parent, ParentSchema>(['address']);
      const parent = new Parent('John', undefined, undefined, undefined, '10 Downing street');

      const result = mapper.fromDomain(parent);
      expect(result).toHaveProperty('address', '10 Downing street');
    });

    it('should map to domain without transformation when provided a string', () => {
      const mapper = new Mapper<Parent, ParentSchema>(['address']);
      const parent = new ParentSchema('John', undefined, undefined, '10 Downing street');

      const result = mapper.toDomain(parent);
      expect(result).toHaveProperty('address', '10 Downing street');
    });
  });

  describe('Tuple mapping', () => {
    it('should map from domain without transformation when provided a tuple', () => {
      const mapper = new Mapper<Parent, ParentSchema>([['name', 'fullName']]);
      const parent = new Parent('John');

      const result = mapper.fromDomain(parent);
      expect(result).toHaveProperty('fullName', 'John');
    });

    it('should map to domain without transformation when provided a tuple', () => {
      const mapper = new Mapper<Parent, ParentSchema>([['name', 'fullName']]);
      const parent = new ParentSchema('John');

      const result = mapper.toDomain(parent);
      expect(result).toHaveProperty('name', 'John');
    });
  });

  describe('Basic transformation', () => {
    it('should map from domain with transformation when provided an object', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'name',
          storageKey: 'fullName',
          fromDomain: (value) => (value as string).toUpperCase(),
        },
      ]);
      const parent = new Parent('John');

      const result = mapper.fromDomain(parent);
      expect(result).toHaveProperty('fullName', 'JOHN');
    });

    it('should map to domain with transformation when provided an object', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'name',
          storageKey: 'fullName',
          toDomain: (value) => (value as string).toUpperCase(),
        },
      ]);
      const parent = new ParentSchema('John');

      const result = mapper.toDomain(parent);
      expect(result).toHaveProperty('name', 'JOHN');
    });
  });

  describe('Mapper transformation', () => {
    it('should map a child from domain with transformation when provided a mapper', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'child',
          storageKey: 'kid',
          mapper: new Mapper<Child, ChildSchema>([
            {
              domainKey: 'name',
              storageKey: 'surname',
              fromDomain: (value) => (value as string).toUpperCase(),
            },
          ]),
        },
      ]);
      const parent = new Parent('John', undefined, new Child('Jane'));

      const result = mapper.fromDomain(parent);
      expect(result).toHaveProperty('kid.surname', 'JANE');
    });

    it('should map a child to domain with transformation when provided a mapper', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'child',
          storageKey: 'kid',
          mapper: new Mapper<Child, ChildSchema>([
            {
              domainKey: 'name',
              storageKey: 'surname',
              toDomain: (value) => (value as string).toUpperCase(),
            },
          ]),
        },
      ]);
      const parent = new ParentSchema('John', new ChildSchema('Jane'));

      const result = mapper.toDomain(parent);
      expect(result).toHaveProperty('child.name', 'JANE');
    });
  });

  describe('Array mapping', () => {
    it('should map an array from domain with transformation when provided an array mapper', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'children',
          storageKey: 'family',
          arrayMapper: new Mapper<Child, ChildSchema>([
            {
              domainKey: 'name',
              storageKey: 'surname',
              fromDomain: (value) => (value as string).toUpperCase(),
            },
          ]),
        },
      ]);
      const parent = new Parent('John', undefined, undefined, [
        new Child('Jane'),
        new Child('Harry'),
      ]);

      const result = mapper.fromDomain(parent);
      expect(result).toHaveProperty('family[0].surname', 'JANE');
      expect(result).toHaveProperty('family[1].surname', 'HARRY');
    });

    it('should map an array to domain with transformation when provided an array mapper', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        {
          domainKey: 'children',
          storageKey: 'family',
          arrayMapper: new Mapper<Child, ChildSchema>([
            {
              domainKey: 'name',
              storageKey: 'surname',
              toDomain: (value) => (value as string).toUpperCase(),
            },
          ]),
        },
      ]);
      const parent = new ParentSchema('John', undefined, [
        new ChildSchema('Jane'),
        new ChildSchema('Harry'),
      ]);

      const result = mapper.toDomain(parent);
      expect(result).toHaveProperty('children[0].name', 'JANE');
      expect(result).toHaveProperty('children[1].name', 'HARRY');
    });
  });

  describe('Change filtering', () => {
    it('should return all the object when it is new', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        ['id', '_id'],
        ['name', 'fullName'],
      ]);
      const parent = new Parent('John');

      const result = mapper.fromDomainChanges(parent);
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('fullName');
    });

    it('should return an empty object when there is no changes on a non new entity', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        ['id', '_id'],
        ['name', 'fullName'],
      ]);
      const parent = new Parent('John', '1234');

      const result = mapper.fromDomainChanges(parent);
      expect(result).toEqual({});
    });

    it('should return only the changed properties when there are changes on a non new entity', () => {
      const mapper = new Mapper<Parent, ParentSchema>([
        ['id', '_id'],
        ['name', 'fullName'],
      ]);
      const parent = new Parent('John', '1234');
      parent.name = 'Jane';

      const result = mapper.fromDomainChanges(parent);
      expect(result).toEqual({fullName: 'Jane'});
    });
  });
});

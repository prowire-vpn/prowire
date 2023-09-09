import {Base} from 'app/domain';
import {BaseSchema} from './base.schema';

type MappingTuple<Domain extends Base, Storage extends BaseSchema<Domain>> = [
  keyof Domain,
  keyof Storage,
];
interface MappingObject<
  Domain extends Base,
  Storage extends BaseSchema<Domain>,
  DK extends keyof Domain,
  SK extends keyof Storage,
> {
  domainKey: DK;
  storageKey: SK;
  /** If a property is another entity that can be mapped, you can provide a mapper or it */
  mapper?: Mapper;
  /** If a property is an array of entities that can be mapped, you can provide a mapper or it */
  arrayMapper?: Mapper;
  toDomain?: (value: Storage[SK]) => Domain[DK];
  fromDomain?: (instance: Domain[DK]) => Storage[SK];
}
export type Mapping<Domain extends Base, Storage extends BaseSchema<Domain>> = Array<
  MappingTuple<Domain, Storage> | MappingObject<Domain, Storage, keyof Domain, keyof Storage>
>;

export class Mapper<Domain extends Base = any, Storage extends BaseSchema<Domain> = any> {
  private readonly domainToStorageMap: Record<keyof Domain, keyof Storage>;

  constructor(private readonly mapping: Mapping<Domain, Storage>) {
    this.domainToStorageMap = mapping.reduce((acc, mapping) => {
      if (Array.isArray(mapping)) {
        const [domain, storage] = mapping;
        acc[domain] = storage;
      } else {
        const {domainKey, storageKey} = mapping;
        acc[domainKey] = storageKey;
      }
      return acc;
    }, {} as Record<keyof Domain, keyof Storage>);
  }

  public toDomain(document: Storage): Record<keyof Domain, any> {
    return this.mapping.reduce((acc, mapping) => {
      if (Array.isArray(mapping)) {
        const [domain, storage] = mapping;
        acc[domain] = document[storage];
        return acc;
      }
      const {domainKey, storageKey, toDomain, mapper, arrayMapper} = mapping;
      if (arrayMapper) {
        if (!Array.isArray(document[storageKey]))
          throw new Error(`Property ${String(storageKey)} is not an array`);
        acc[domainKey] = (document[storageKey] as Array<any>).map((value) =>
          arrayMapper.toDomain(value),
        );
        return acc;
      }

      const modifier = toDomain ?? mapper?.toDomain.bind(mapper);
      acc[domainKey] = modifier ? modifier(document[storageKey]) : document[storageKey];
      return acc;
    }, {} as Record<keyof Domain, any>);
  }

  public fromDomain(instance: Domain): Record<keyof Storage, any> {
    return this.mapping.reduce((acc, mapping) => {
      if (Array.isArray(mapping)) {
        const [domain, storage] = mapping;
        acc[storage] = instance[domain];
        return acc;
      }
      const {domainKey, storageKey, fromDomain, mapper, arrayMapper} = mapping;
      if (arrayMapper) {
        if (!Array.isArray(instance[domainKey]))
          throw new Error(`Property ${String(domainKey)} is not an array`);
        acc[storageKey] = (instance[domainKey] as Array<any>).map((value) =>
          arrayMapper.fromDomain(value),
        );
        return acc;
      }
      const modifier = fromDomain ?? mapper?.fromDomain.bind(mapper);
      acc[storageKey] = modifier ? modifier(instance[domainKey]) : instance[domainKey];
      return acc;
    }, {} as Record<keyof Storage, any>);
  }

  public fromDomainChanges(instance: Domain): Record<keyof Storage, any> {
    const storage = this.fromDomain(instance);
    if (instance.newEntity) return storage;

    const filter: Array<keyof Storage> = [];
    for (const property of instance.changedProperties) {
      const mapped = this.domainToStorageMap[property as keyof Domain];
      if (!mapped) throw new Error(`Unknown property ${String(property)}`);
      filter.push(mapped);
    }

    return filter.reduce((acc, property) => {
      acc[property] = storage[property];
      return acc;
    }, {} as Record<keyof Storage, any>);
  }
}

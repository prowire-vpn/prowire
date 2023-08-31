import {Base} from 'app/domain';
import {BaseSchema} from './base.schema';

type MappingTuple<Domain extends Base, Storage extends BaseSchema<Domain>> = [
  keyof Domain,
  keyof Storage,
];
interface MappingObject<Domain extends Base, Storage extends BaseSchema<Domain>> {
  domainKey: keyof Domain;
  storageKey: keyof Storage;
  toDomain?: (value: Storage[keyof Storage]) => Domain[keyof Domain];
  fromDomain?: (instance: Domain[keyof Domain]) => Storage[keyof Storage];
}
export type Mapping<Domain extends Base, Storage extends BaseSchema<Domain>> = Array<
  MappingTuple<Domain, Storage> | MappingObject<Domain, Storage>
>;

export class Mapper<Domain extends Base, Storage extends BaseSchema<Domain>> {
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
      } else {
        const {domainKey, storageKey, toDomain} = mapping;
        acc[domainKey] = toDomain ? toDomain(document[storageKey]) : document[storageKey];
      }
      return acc;
    }, {} as Record<keyof Domain, any>);
  }

  public fromDomain(instance: Domain): Record<keyof Storage, any> {
    return this.mapping.reduce((acc, mapping) => {
      if (Array.isArray(mapping)) {
        const [domain, storage] = mapping;
        acc[storage] = instance[domain];
      } else {
        const {domainKey, storageKey, fromDomain} = mapping;
        acc[storageKey] = fromDomain ? fromDomain(instance[domainKey]) : instance[domainKey];
      }
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

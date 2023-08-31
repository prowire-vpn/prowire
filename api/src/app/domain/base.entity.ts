import {ObjectId} from 'bson';

export interface BaseConstructor {
  id?: string;
}

export abstract class Base {
  public readonly id: string;
  public readonly newEntity: boolean;
  protected initialized = false;
  public readonly changedProperties = new Set<string | symbol>();

  constructor(init: BaseConstructor) {
    this.id = init.id ?? new ObjectId().toHexString();
    this.newEntity = !init.id;
    const proxy = new Proxy(this, {
      set: (obj, prop, value) => {
        if (this.initialized) {
          this.changedProperties.add(prop);
        }
        return Reflect.set(obj, prop, value); // set the property
      },
    });
    return proxy;
  }
}

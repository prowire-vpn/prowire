export type Newable<T> = {new (...args: any[]): T};

interface Flavoring<FlavorT> {
  _type?: FlavorT;
}

export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;
export type ID<T> = Flavor<string, T>;

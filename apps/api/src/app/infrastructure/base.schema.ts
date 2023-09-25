import {Base} from 'app/domain';

export abstract class BaseSchema<Domain extends Base> {
  public _id!: string;
  protected static domainMapping: Array<[string, string]> = [];
  public toDomain!: () => Domain;
}

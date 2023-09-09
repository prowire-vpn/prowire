export class EmailAddress {
  public local: string;
  public domain: string;

  constructor(address: string) {
    const [local, domain] = address.split('@');
    this.local = local;
    this.domain = domain;
  }

  toString(): string {
    return `${this.local}@${this.domain}`;
  }
}

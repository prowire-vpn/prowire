class LocalStorageMock {
  public constructor(protected store: Record<string, string> = {}) {}

  public get length(): number {
    return Object.keys(this.store).length;
  }

  public clear(): void {
    this.store = {};
  }

  public getItem(key: string): string | null {
    return this.store[key] || null;
  }

  public setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  public removeItem(key: string): void {
    delete this.store[key];
  }

  public key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

global.localStorage = new LocalStorageMock();

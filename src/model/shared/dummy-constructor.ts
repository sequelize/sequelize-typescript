export interface DummyConstructor {
  new(...args: any[]): any;
  [key: string]: Function;
}

export interface IDummyConstructor {
  new(...args: any[]): any;
  [key: string]: Function;
}

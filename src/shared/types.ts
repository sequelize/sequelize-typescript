export type Diff<T extends string | symbol | number, U extends string | symbol | number> = ({
  [P in T]: P;
} &
  { [P in U]: never } & { [x: string]: never })[T];

export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export type NonAbstract<T> = { [P in keyof T]: T[P] };

export type Constructor<T> = new (...args: any[]) => T;

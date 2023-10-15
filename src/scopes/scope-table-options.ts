import { ScopeFindOptions } from './scope-find-options';

export interface ScopeTableOptions<TCreationAttributes extends {}, TModelAttributes extends {}> {
  [scopeName: string]:
    | ScopeFindOptions<TCreationAttributes, TModelAttributes>
    | Function
    | undefined;
}

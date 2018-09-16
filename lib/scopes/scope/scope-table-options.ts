import {ScopeFindOptions} from "./find-include/scope-find-options";

/**
 * Based on "DefineScopeOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L5045
 */

export interface ScopeTableOptions {

  [scopeName: string]: ScopeFindOptions | Function | undefined;
}

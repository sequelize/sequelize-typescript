import 'reflect-metadata';
import {SequelizeModelService} from "../utils/SequelizeModelService";
import {DefineScopeOptions} from "sequelize";

/**
 * Sets scopes for annotated class
 */
export function Scopes(scopes: DefineScopeOptions): Function {

  return (target: any) => {

    const options = SequelizeModelService.getOptions(target.prototype);

    options.scopes = scopes;
  };
}

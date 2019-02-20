import * as path from "path";
import * as glob from "glob";
import {uniqueFilter} from "../../shared/array";
import {ModelMatch, SequelizeOptions} from "./sequelize-options";
import {Model} from "../../model/model/model";

/**
 * Prepares sequelize config passed to original sequelize constructor
 */
export function prepareOptions(options: SequelizeOptions): SequelizeOptions {
  if (options.validateOnly) {
    return getValidationOnlyOptions(options);
  }
  return {...options as SequelizeOptions};
}

export function prepareArgs(...args: any[]) {
  const lastArg = args[args.length - 1];
  const options = lastArg && typeof lastArg === 'object'
    ? prepareOptions(lastArg) : undefined;

  if (options) {
    args[args.length - 1] = options;
  }
  return {preparedArgs: args, options};
}

function getValidationOnlyOptions(options: SequelizeOptions): SequelizeOptions {
  return {
    ...options,
    database: '_name_',
    username: '_username_',
    password: '_password_',
    dialect: 'sqlite',
    dialectModulePath: __dirname + '/../validation-only/db-dialect-dummy'
  } as SequelizeOptions;
}

/**
 * Determines models from value
 */
export function getModels(
  arg: Array<typeof Model | string>,
  modelMatch: ModelMatch,
): Array<typeof Model> {

  if (arg && typeof arg[0] === 'string') {

    return arg.reduce((models: any[], dir) => {

      if (!glob.hasMagic(dir)) dir = path.join(dir, '/*');
      const _models = glob
        .sync(dir as string)
        .filter(isImportable)
        .map(getFullfilepathWithoutExtension)
        .filter(uniqueFilter)
        .map(fullPath => {

          const module = require(fullPath);
          const fileName = path.basename(fullPath);

          const matchedMemberKey = Object.keys(module).find(m => modelMatch(fileName, m));
          const matchedMember = matchedMemberKey ? module[matchedMemberKey] : undefined;

          if (!matchedMember && !module.default) {
            throw new Error(`No default export defined for file "${fileName}" or ` +
              `export does not satisfy filename.`);
          }
          return matchedMember || module.default;
        });

      models.push(..._models);

      return models;
    }, [])
      ;
  }

  return arg as Array<typeof Model>;
}

/**
 * Checks if specified filename is importable or not;
 * Which means that, it needs to have a specific file extension
 */
function isImportable(file: string): boolean {
  const filePart = file.slice(-3);
  return filePart === '.js' || (filePart === '.ts' && file.slice(-5) !== '.d.ts');
}

/**
 * Return the value of the full path with filename, without extension
 */
function getFullfilepathWithoutExtension(file: string): string {
  const parsedFile = path.parse(file);
  return path.join(parsedFile.dir, parsedFile.name);
}

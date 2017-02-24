import 'reflect-metadata';
import {getSequelizeTypeByDesignType, addAttribute} from "../services/models";
import {IPartialDefineAttributeColumnOptions} from "../interfaces/IPartialDefineAttributeColumnOptions";

export function Column(options: IPartialDefineAttributeColumnOptions): Function;
export function Column(target: any, propertyName: string): void;
export function Column(...args: any[]): Function|void {

  // In case of no specified options, we retrieve the
  // sequelize data type by the type of the property
  if (args.length >= 2) {

    const target = args[0];
    const propertyName = args[1];

    annotate(target, propertyName);
    return;
  }

  return (target: any, propertyName: string) => {
    annotate(target, propertyName, args[0]);
  };
}

function annotate(target: any,
                  propertyName: string,
                  options: IPartialDefineAttributeColumnOptions = {}): void {

  options = Object.assign({}, options);

  if (!options.type) {
    options.type = getSequelizeTypeByDesignType(target, propertyName);
  }

  addAttribute(target, propertyName, options);
}

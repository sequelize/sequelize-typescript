import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Don't allow empty strings
 */
export function NotEmpty({msg}: {msg?: string}): Function {

  let options: boolean | {msg: string};
      
  if (msg) {
    options = {msg};
  } else {
    options = true;
  }
  
  return (target: any, propertyName: string) => {
    addAttributeOptions(target, propertyName, {
      validate: {
        notEmpty: options
      }
    });
  }
}

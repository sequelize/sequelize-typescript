import {Inject} from "di-ts";

@Inject
export class UtilityService {

  toBoolean(value: any) {

    if(value === void 0) {

      return false;
    }

    switch (typeof value) {
      case 'string':
        return value === 'true';
      case 'number':
        return value === 1;
      case 'object':
        return true;
      case 'boolean':
        return value;
      default:
        return null;
    }
  }

  toArray<T>(value: any, ensureArray = false): T[] {

    if(value === void 0) {

      if(ensureArray) {
        return [];
      }
      return null;
    }

    return [].concat(value);
  }
}

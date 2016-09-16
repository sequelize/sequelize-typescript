import {Inject} from "di-ts";

@Inject
export class UtilityService {
  
  isNumber(value: any) {
    
    return typeof value === 'number';
  }

  toBoolean(value: any, ensureBoolean = false) {

    if(value === void 0 && ensureBoolean) {

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
      default:
        return value;
    }
  }
  
  toFloat(value: string, ensureFloat = false) {
    
    if(isFinite(<any>value)) {
      
      return parseFloat(value);
      
    } else if(ensureFloat) {
      
      return 0.0;
    }
    
    return null;
  }
  
  toInt(value: string, ensureInt = false) {
    
    if(isFinite(<any>value)) {
      
      return parseInt(value);
      
    } else if(ensureInt) {
      
      return 0;
    }
    
    return null;
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

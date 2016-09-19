import {BaseError} from "./BaseError";

export class NotImplementedError extends BaseError {

  statusCode = HttpStatus.NotFound;
  message: string  = 'This resource is not implemented on this version';

  constructor() {
    
    super(true);
  }
}

import {BaseError} from "./BaseError";

export class UserNotFoundError extends BaseError {
  
  code = HttpStatus.NotFound;

  constructor(public message: string = 'User not found') {
    super(true);
  }
}

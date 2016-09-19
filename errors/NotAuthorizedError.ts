import {BaseError} from "./BaseError";

export class NotAuthorizedError extends BaseError {

  statusCode = HttpStatus.Unauthorized;

  constructor(public message: string) {

    super(true);
  }
}

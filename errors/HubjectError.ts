import {BaseError} from "./BaseError";

export class HubjectError extends BaseError {

  constructor(public hubjectErrorCode: string,
              public message: string,
              public statusCode: HttpStatus) {

    super(true);
  }
}

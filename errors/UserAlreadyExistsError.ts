import {BaseError} from "./BaseError";

export class UserAlreadyExistsError extends BaseError {

  statusCode = HttpStatus.Conflict;
  message: string;

  constructor(evcoId: string){
    super(true);

      this.message = `User with EVCOID '${evcoId}' already exists`;
  }
}

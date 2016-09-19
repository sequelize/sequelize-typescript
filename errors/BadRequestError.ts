import {BaseError} from "./BaseError";

export class BadRequestError extends BaseError {

  statusCode = HttpStatus.BadRequest;
  
  constructor(public message: string){
    
    super(true);
  }

}

import {BaseError} from "./BaseError";

export class InvalidDataError extends BaseError {

  statusCode = HttpStatus.BadRequest;
  
  constructor(public message: string){
    
    super(true);
  }

}

export class InvalidDataError extends Error {

  statusCode = HttpStatus.BadRequest;
  
  constructor(public message: string){
    super();
  }

}

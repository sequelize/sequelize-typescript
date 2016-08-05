export class BadRequestError extends Error {

  statusCode = HttpStatus.BadRequest;
  
  constructor(public message: string){
    super();
  }

}

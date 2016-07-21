
export class ParametersMissingError extends Error {

  statusCode = HttpStatus.BadRequest;
  message: string;
  
  constructor(paramKeys: string[]) {
    super();
    
    this.message = `Parameters missing. The following parameters are required: ${paramKeys.join(', ')}`;
  }

}

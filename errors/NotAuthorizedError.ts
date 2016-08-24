export class NotAuthorizedError extends Error {
  
  statusCode = HttpStatus.Unauthorized;

  constructor(public message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends Error {
  
  code = HttpStatus.Unauthorized;

  constructor(public message: string) {
    super(message);
  }
}

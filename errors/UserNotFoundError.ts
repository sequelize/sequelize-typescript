export class UserNotFoundError extends Error {
  
  code = HttpStatus.NotFound;

  constructor(public message: string = 'User not found') {
    super();
  }
}

export class UserAlreadyExistsError extends Error {

  statusCode = HttpStatus.Conflict;
  message: string;

  constructor(evcoId: string){
    super();

      this.message = `User with EVCOID '${evcoId}' already exists`;
  }
}

export class AuthenticationFailedError extends Error {

  constructor(public message: string) {
    super(message);
  }
}

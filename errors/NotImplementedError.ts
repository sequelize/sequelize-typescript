
export class NotImplementedError extends Error {

  statusCode = HttpStatus.NotFound;
  message: string  = 'This resource is not implemented on this version';

}

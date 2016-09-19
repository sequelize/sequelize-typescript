export class BaseError extends Error {

  constructor(
    // indicates if this error can be passed to the client
    public secureToShow: boolean
  ) {
    super();
  }

}

export class ParametersMissingError extends Error {

  statusCode = HttpStatus.BadRequest;
  message: string;

  constructor(...paramKeys: string[][]) {
    super();

    if (paramKeys.length === 1) {

      this.message = `Parameters missing. The following parameters are required: ${paramKeys[0].join(', ')}`;
    } else {

      this.message = `Parameters missing. Either ${paramKeys.map(params => params.join(', ')).join(' or ')} are required.`;
    }
  }
}


export enum ErrorCode {

    AuthenticationFailed
}

export class CodeError extends Error{

    constructor(public message: string, public code: ErrorCode) {

        super();
    }
}

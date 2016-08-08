
export interface IMobileAuthorizationStart {
  
  SessionID: string;
  AuthorizationStatus: string;
  StatusCode: {
    Code: string;
    Description: string;
  }
}

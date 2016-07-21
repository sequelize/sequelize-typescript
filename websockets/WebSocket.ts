import {WebSocketService} from "./WebSocketService";

export abstract class WebSocket {
  
  constructor() {
    
    WebSocketService.initializeSockets(this, this.getSocketNamespacePrefix());
  }
  
  abstract getSocketNamespacePrefix(): string;
}

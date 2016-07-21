import {WebSocketService} from "./WebSocketService";
export function SocketNamespace(target: any, namespace: string) {

  WebSocketService.addNameSpace(target.constructor, namespace);
}

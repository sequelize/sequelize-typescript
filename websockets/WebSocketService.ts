import {Inject} from "di-ts";
import socket = require('socket.io');
import http = require('http');

const io = socket(http);
const NAMESPACE_KEY = 'socket:namespace';

export class WebSocketService {

  static addNameSpace(_class: any, namespace: string) {

    const namespaces = this.getNamespaces(_class);

    namespaces.push(namespace);
  }

  static getNamespaces(_class: any): string[] {

    let namespaces = Reflect.getMetadata(NAMESPACE_KEY, _class);

    if(!namespaces) {
      namespaces = [];
      Reflect.defineMetadata(NAMESPACE_KEY, namespaces, _class);
    }

    return namespaces;
  }
  
  static initializeSockets(instance: any, prefix: string) {
    
    const _class = instance.constructor;
    const namespaces = WebSocketService.getNamespaces(_class);
    
    namespaces.forEach(namespace => instance[namespace] = io.of([prefix, namespace].join('.')));
  }
}

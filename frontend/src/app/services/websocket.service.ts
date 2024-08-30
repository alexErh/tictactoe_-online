import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Socket {
  constructor() {
    super(config);
  }
}

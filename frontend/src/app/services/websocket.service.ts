import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;

  connect(namespace: string) {
    if (!this.socket || this.socket.disconnected) {
      this.socket = io(`http://localhost:3000/${namespace}`, {
        transports: ['websocket']
      });
      console.log('WebSocket connected:', this.socket.id);
    }
  }

  getSocket(): Socket {
    return this.socket;
  }

  listen(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        subscriber.next(data);
      });

      return () => this.socket.off(event);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('WebSocket disconnected');
    }
  }
}

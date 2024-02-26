import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService {

  private isConnectionAvailable: boolean = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isConnectionAvailable = true;
    });

    window.addEventListener('offline', () => {
      this.isConnectionAvailable = false;
    });
  }

  isConnected() {
    return this.isConnectionAvailable;
  }

}

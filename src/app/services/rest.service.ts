import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { InternetConnectionService } from './internet-connection.service';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    constructor(private auth: AuthService, private internetConnection: InternetConnectionService) { }

    async canReachTheBackend() {
        return (await this.auth.isLoggedIn() && this.internetConnection.isConnected());
    }

    getHeaders() {
        return new HttpHeaders()
            .set('Content-Type', 'application/json; charset=utf-8')
            .set('Accept', 'application/json');
    }
}

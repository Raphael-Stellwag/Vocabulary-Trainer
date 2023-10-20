import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorageNamespace} from './local-storage.namespace';
//import { toBase64String } from '@angular/compiler/src/output/source_map';

@Injectable()
export class AuthService {
  private loggedIn: boolean = null;
  private user: string = null;
  private token: string = null;

  constructor(private httpClient: HttpClient) {
    this.loggedIn = LocalStorageNamespace.isLoggedIn();
    if (this.loggedIn) {
      this.user = LocalStorageNamespace.getUser();
      this.token = LocalStorageNamespace.getAuthenticationToken();
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getAuthToken() {
    return this.token;
  }

  register(user, password) {
    if (this.loggedIn) {
      return null;
    }
    let userObject = {
      username: user,
      password: password
    }
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.auth.REGISTER, JSON.stringify(userObject)).toPromise()
          .then((result: any) => {
        this.saveCredentials(userObject);
        resolve(""); //TODO: fix why here is "" needed
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  login(user, password) {
    if (this.loggedIn) {
      return null;
    }
    let userObject = {
      username: user,
      password: password
    }
    let promise = new Promise((resolve, reject) => {
      this.httpClient.post(environment.auth.LOGIN, JSON.stringify(userObject)).toPromise()
          .then((result: any) => {
        this.saveCredentials(userObject);
        resolve(""); //TODO: fix why here is "" needed
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });

    return promise;
  }

  logout() {
    console.error("Must be implemented");
  }

  getUsername(): string {
    return this.user;
  }

  private saveCredentials(userObject: any) {
    this.user = userObject.username;
    this.loggedIn = true;
    // Create Base64 Object
    //let Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


// Encode the String

    let stringToEncode = userObject.username + ":" + userObject.password
    //let token = Base64.encode(stringToEncode);
    let token = btoa(stringToEncode);
    this.user = userObject.username;
    this.loggedIn = true;
    this.token = token;
    console.log(token); 
    LocalStorageNamespace.setAuthentificationToken(token);
    LocalStorageNamespace.setUser(userObject.username)
    LocalStorageNamespace.setLoggedInToTrue();
    
  }

}
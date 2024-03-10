import { Injectable } from '@angular/core';

import {KeycloakService} from 'keycloak-angular';

@Injectable()
export class AuthService {

  constructor(private keycloakService: KeycloakService) {
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  async logout() {
    await this.keycloakService.logout();
  }

  getUsername(): string {
    return this.keycloakService.getUsername();
  }

  async getAuthToken() {
    return await this.keycloakService.getToken()
  }

  async login(): Promise<boolean> {
    await this.keycloakService.login();
    return this.isLoggedIn();
  }
}

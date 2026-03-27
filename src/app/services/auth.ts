import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  user = signal<any>(null);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.isAuthenticated.set(true);
        this.user.set(JSON.parse(user));
      }
    }
  }

  setAuth(token: string, user: any) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.isAuthenticated.set(true);
    this.user.set(user);
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isAuthenticated.set(false);
    this.user.set(null);
  }
}

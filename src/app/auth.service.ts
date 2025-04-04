import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleKey = 'userRole';
  private router = inject(Router);

  login(role: 'admin' | 'user') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.roleKey, role);
    }
    this.router.navigate(['/dashboard']);
  }

  getRole(): 'admin' | 'user' | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.roleKey) as 'admin' | 'user' | null;
  }

  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('userRole') !== null;
  }
  

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.roleKey);
    }
    this.router.navigate(['/login']);
  }
}

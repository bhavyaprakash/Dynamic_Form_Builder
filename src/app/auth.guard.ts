import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  if (state.url === '/form-builder' && userRole !== 'admin') {
    router.navigate(['/login']); // Redirect Users back to Login
    return false;
  }

  // Allow access if authenticated
  return userRole ? true : (router.navigate(['/login']), false);
};

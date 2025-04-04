import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  userRole: string | null;

  constructor(private authService: AuthService, private router: Router) {
    this.userRole = this.authService.getRole();
  }
  goToFormBuilder() {
    this.router.navigate(['/form-builder']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormService } from '../form.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  DEFAULT_TEMPLATES = [
    {
      id: 1,
      name: 'Employee Feedback Form',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'textarea', label: 'Feedback', required: true },
        { type: 'radio', label: 'Satisfaction Level', options: ['Good', 'Average', 'Bad'] },
      ],
    },
    {
      id: 2,
      name: 'Event Registration Form',
      fields: [
        { type: 'text', label: 'Full Name', required: true },
        { type: 'text', label: 'Email', required: true },
        { type: 'date', label: 'Event Date' },
      ],
    },
  ];
  
  formTemplates: any[] = [];
  displayedColumns: string[] = ['name', 'actions']; // Define columns
  dataSource: any[] = [];
  submittedDataSource: any[] = [];

  userRole: string | null;

  constructor(private authService: AuthService, private router: Router, private formService: FormService) {
    this.userRole = this.authService.getRole();
  }

  ngOnInit() {
    console.log("Loading form templates...");
  
    // Load stored forms from localStorage
    const storedForms = localStorage.getItem('formTemplates');
  
    if (storedForms && JSON.parse(storedForms).length > 0) {
      this.dataSource = JSON.parse(storedForms);
    } else {
      console.log("No valid stored forms found. Using default templates.");
      
      // Use default templates and save them to localStorage
      this.dataSource = [...this.DEFAULT_TEMPLATES];
      localStorage.setItem('formTemplates', JSON.stringify(this.dataSource));
    }
  
    const storedSubmissions = localStorage.getItem('submittedForms');
  this.submittedDataSource = storedSubmissions ? JSON.parse(storedSubmissions) : [];

  console.log("Final Data Source:", this.dataSource);
  console.log("Submitted Forms Data Source:", this.submittedDataSource);
  }

  loadForm(element: any, viewOnly = false) {
    const formToLoad = { ...element, isViewMode: viewOnly };
    localStorage.setItem('loadedForm', JSON.stringify(formToLoad));
    this.router.navigate(['/fill-form']);
    console.log('Form to load:', formToLoad);

  }
  

  editForm(formTemplate: any) {
    localStorage.setItem('editingForm', JSON.stringify(formTemplate));
    this.router.navigate(['/form-builder']);
  }
  

  deleteForm(id: number) {
    this.formService.deleteForm(id); 
    this.ngOnInit(); 
  }
  
  deleteSubmitForm(id: number) {
    const stored = localStorage.getItem('submittedForms');
    let submittedForms = stored ? JSON.parse(stored) : [];
  
    submittedForms = submittedForms.filter((form: any) => form.id !== id);
    localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
  
    this.submittedDataSource = submittedForms; // Update the table
  }
  
  
  
  goToFormBuilder() {
    this.router.navigate(['/form-builder']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

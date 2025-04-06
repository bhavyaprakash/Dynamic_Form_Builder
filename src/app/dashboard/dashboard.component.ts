import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectAllFormTemplates } from '../state/form-templates/form-template.selectors';
import { FormTemplateActions } from '../state/form-templates/form-templates.actions';
import { MockApiService } from '../mock-api.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  formTemplates: any[] = [];
  displayedColumns: string[] = ['name', 'actions']; // Define columns
  dataSource: any[] = [];
  submittedDataSource: any[] = [];
  submittedFormIds: number[] = [];
  userRole: string | null;

  constructor(private authService: AuthService, private router: Router, private store: Store, 
    private mockApi: MockApiService,) {
    this.userRole = this.authService.getRole();
  }

  ngOnInit() {
    this.store.select(selectAllFormTemplates).subscribe((templates) => {
      this.dataSource = templates;
      console.log('Form Templates from Store:', this.dataSource);
    });
  
    this.mockApi.getSubmittedForms().subscribe((submissions) => {
      this.submittedDataSource = submissions;
      this.submittedFormIds = submissions.map((form: { id: any; }) => form.id);
      console.log("ids", this.submittedFormIds)
    });
  }
  
  loadForm(element: any, viewOnly = false) {
    this.mockApi.setLoadedForm(element, viewOnly);
    this.router.navigate(['/fill-form']);
  }
  

  editForm(formTemplate: any) {
    this.store.dispatch(FormTemplateActions.setEditingFormTemplate({ formTemplate }));
    this.router.navigate(['/form-builder']);
  }
  

  deleteForm(id: number) {
    this.store.dispatch(FormTemplateActions.deleteFormTemplate({ id }));
  }
  
  deleteSubmitForm(id: number) {
    this.mockApi.deleteSubmittedForm(id).subscribe(() => {
      this.mockApi.getSubmittedForms().subscribe((submissions) => {
        this.submittedDataSource = submissions;
      });
    });
  }
  
  goToFormBuilder() {
    this.router.navigate(['/form-builder']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

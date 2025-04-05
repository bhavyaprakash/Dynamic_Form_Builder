import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormTemplate } from './form-templates.model';


@Injectable({
  providedIn: 'root'
})
export class FormTemplateService {
  getAll(): Observable<FormTemplate[]> {
    const mockData: FormTemplate[] = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    return of(mockData);
  }

  // You can add create/update/delete if needed
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }
  private formStructure: any[] = [];

  private storageKey = 'formTemplates';

  saveForm(formTemplate: any) {
    let storedForms = this.getForms(); // Get existing forms
  
    // Check if the form already exists (by ID)
    const existingIndex = storedForms.findIndex(form => form.id === formTemplate.id);
  
    if (existingIndex !== -1) {
      // ✅ Update the existing form
      storedForms[existingIndex] = formTemplate;
    } else {
      // ✅ Save as a new form
      storedForms.push(formTemplate);
    }
  
    localStorage.setItem(this.storageKey, JSON.stringify(storedForms));
  }
  
  
  

  getForms(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  deleteForm(id: number) {
    let storedForms = this.getForms();
    storedForms = storedForms.filter(form => form.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(storedForms));
  }
}

import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  submitForm(data: any) {
    console.log('Mock API submit:', data);
    return of({ success: true, message: 'Form submitted successfully!' }).pipe(delay(1000));
  }

  getSubmittedForms() {
    const stored = localStorage.getItem('submittedForms');
    return of(stored ? JSON.parse(stored) : []).pipe(delay(500));
  }

  saveSubmittedForm(data: any) {
    const stored = localStorage.getItem('submittedForms');
    const submittedForms = stored ? JSON.parse(stored) : [];
    submittedForms.push(data);
    localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
    return of(true).pipe(delay(300));
  }

  deleteSubmittedForm(id: number) {
    const stored = localStorage.getItem('submittedForms');
    let submittedForms = stored ? JSON.parse(stored) : [];
    submittedForms = submittedForms.filter((form: any) => form.id !== id);
    localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
    return of(true).pipe(delay(300));
  }

  setLoadedForm(form: any, viewOnly: boolean = false) {
    const formToLoad = { ...form, isViewMode: viewOnly };
    localStorage.setItem('loadedForm', JSON.stringify(formToLoad));
  }
  
  getLoadedForm() {
    const storedForm = localStorage.getItem('loadedForm');
    return storedForm ? JSON.parse(storedForm) : null;
  }
}

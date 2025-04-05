import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-form-submission',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './form-submission.component.html',
  styleUrl: './form-submission.component.css'
})
export class FormSubmissionComponent {

  submissionForm!: FormGroup;
  formTemplate: any;
  isViewMode = false;
  userRole: string | null;

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService,) {
    this.userRole = this.authService.getRole();
  }

  ngOnInit() {
    const storedForm = localStorage.getItem('loadedForm');
    
    if (storedForm) {
      this.formTemplate = JSON.parse(storedForm);
      this.isViewMode = !!this.formTemplate.isViewMode;
  
      if (!Array.isArray(this.formTemplate.fields)) {
        this.formTemplate.fields = Object.values(this.formTemplate.fields);
      }
  
      this.buildForm();
  
      if (this.isViewMode && this.formTemplate.submittedValues) {
        this.submissionForm.patchValue(this.formTemplate.submittedValues);
      }
    }
  }
  

  buildForm() {
    const formGroup: any = {};
    const isDisabled = this.formTemplate.isViewMode;
    const submittedValues = this.formTemplate.submittedValues || {};
  
    this.formTemplate.fields.forEach((field: any) => {
      const validators = [];
  
      if (field.required) validators.push(Validators.required);
      if (field.validation?.minLength) validators.push(Validators.minLength(field.validation.minLength));
      if (field.validation?.maxLength) validators.push(Validators.maxLength(field.validation.maxLength));
      if (field.validation?.pattern) validators.push(Validators.pattern(field.validation.pattern));
  
      const value = submittedValues[field.label] ?? ''; // Fallback to empty
  
      if (field.type === 'checkbox') {
        formGroup[field.label] = new FormControl({ value, disabled: isDisabled });
      } else {
        formGroup[field.label] = new FormControl({ value, disabled: isDisabled }, validators);
      }
    });
  
    this.submissionForm = this.fb.group(formGroup);
  }
  
  
  onCheckboxChange(event: any, fieldLabel: string) {
    const checkArray: FormArray = this.submissionForm.get(fieldLabel) as FormArray;
  
    if (event.target.checked) {
      checkArray.push(new FormControl(event.target.value));
    } else {
      const index = checkArray.controls.findIndex(x => x.value === event.target.value);
      checkArray.removeAt(index);
    }
  }
  

  onSubmit() {
    if (this.submissionForm.invalid) {
      alert("Please fill the form correctly.");
      return;
    }
  
    const submittedData = {
      ...this.formTemplate, // keep id, name, fields (structure)
      submittedValues: this.submissionForm.getRawValue(), // save values separately
      submittedAt: new Date().toISOString()
    };
  
    const storedSubmissions = localStorage.getItem('submittedForms');
    let submittedForms = storedSubmissions ? JSON.parse(storedSubmissions) : [];
  
    submittedForms.push(submittedData);
    localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
  
    alert("Form submitted successfully!");
    this.router.navigate(['/dashboard']);
  }
  
  
  
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { FormService } from '../form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditFieldDialogComponent } from '../edit-field-dialog/edit-field-dialog.component';
import { Store } from '@ngrx/store';
// import { FormTemplate } from '../state/form-templates/form-templates.model';
// import { FormTemplateActions } from '../state/form-templates/form-templates.actions';

interface FormField {
  type: string;
  label: string;
  required: boolean;
  helpText: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css'
})
export class FormBuilderComponent {

  availableFields = [
    { type: 'text', label: 'Text Input' },
    { type: 'textarea', label: 'Multi-line Text' },
    { type: 'select', label: 'Dropdown' },
    { type: 'checkbox', label: 'Checkbox Group' },
    { type: 'date', label: 'Date Picker' },
    { type: 'radio', label: 'Radio Buttons' }
  ];

  formFields: any[] = [];
  selectedField: FormField | null = null;
  fieldConfigForm!: FormGroup;
  formName: string = ''; // Holds the form name entered by the user
  editingFormId: number | null = null;


  constructor(private formService: FormService, private dialog: MatDialog) {
    this.initForm();
  }

  ngOnInit() {
    const storedForm = localStorage.getItem('editingForm');

    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      this.editingFormId = parsedForm.id; // ✅ Set editingFormId
      this.formFields = parsedForm.fields; // Load fields
      this.formName = parsedForm.name; // Load form name
      localStorage.removeItem('editingForm'); // Clear after loading
    }
}

  initForm() {
    this.fieldConfigForm = new FormGroup({
      label: new FormControl(''),
      required: new FormControl(false),
      helpText: new FormControl(''),
      validation: new FormControl(''),
    });
  }

  drop(event: any) {
    if (event.previousContainer === event.container) return;
    const field = { ...event.previousContainer.data[event.previousIndex], required: false, helpText: '' };
    this.formFields.push(field);
  }

  editField(field: any) {
    console.log("field", field)
    const dialogRef = this.dialog.open(EditFieldDialogComponent, {
      width: '400px',
      data: field // Pass the field data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the field with the result from the dialog
        const index = this.formFields.findIndex(f => f.label === field.label);
        if (index !== -1) {
          this.formFields[index] = { ...this.formFields[index], ...result };
        }
      }
    });
  }

  deleteField(index: number) {
    this.formFields.splice(index, 1);
  }

  saveForm() {
    if (!this.formName) {
      alert("Please enter a form name before saving.");
      return;
    }
  
    const formTemplate = {
      id: this.editingFormId || Math.floor(Math.random() * 100) + 1, // Use existing ID if editing, otherwise generate a new one
      name: this.formName,
      fields: this.formFields
    };
  
    this.formService.saveForm(formTemplate);
    alert(this.editingFormId ? 'Form Updated Successfully!' : 'Form Saved Successfully!');
  
    // Reset form after saving
    this.formFields = [];
    this.formName = "";
    this.editingFormId = null;
  }
  
  // resetForm() {
  //   this.formFields = []; // Clear all added fields
  //   this.selectedField = null; // Reset selected field (if any)
  // }
  
  // saveForm() {
  //   if (!this.formName) {
  //     alert("Please enter a form name before saving.");
  //     return;
  //   }

  //   const formTemplate: FormTemplate = {
  //     id: this.editingFormId || Math.floor(Math.random() * 100) + 1,
  //     name: this.formName,
  //     fields: this.formFields
  //   };

  //   if (this.editingFormId) {
  //     this.store.dispatch(FormTemplateActions.updateFormTemplate({
  //       formTemplate: { id: formTemplate.id, changes: formTemplate }
  //     }));
  //   } else {
  //     this.store.dispatch(FormTemplateActions.addFormTemplate({ formTemplate }));
  //   }    

  //   alert(this.editingFormId ? 'Form Updated Successfully!' : 'Form Saved Successfully!');
  //   this.resetForm();
  // }

  resetForm() {
    this.formFields = [];
    this.formName = "";
    this.editingFormId = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditFieldDialogComponent } from '../edit-field-dialog/edit-field-dialog.component';
import { Store } from '@ngrx/store';
import { FormTemplate } from '../state/form-templates/form-templates.model';
import { FormTemplateActions } from '../state/form-templates/form-templates.actions';
import { selectEditingFormTemplate } from '../state/form-templates/form-template.selectors';
import { Router } from '@angular/router';

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
export class FormBuilderComponent implements OnInit {

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
  formName: string = '';
  editingFormId: number | null = null;


  constructor(private router: Router, private store: Store, private dialog: MatDialog) {
    this.initForm();
  }

  ngOnInit() {
    this.store.select(selectEditingFormTemplate).subscribe((formTemplate) => {
      if (formTemplate) {
        this.editingFormId = formTemplate.id;
        this.formName = formTemplate.name;
        this.formFields = formTemplate.fields;
      }
    });
  }


  initForm() {
    this.fieldConfigForm = new FormGroup({
      label: new FormControl(''),
      required: new FormControl(false),
      helpText: new FormControl(''),
      validation: new FormControl(''),
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      this.formFields = [...this.formFields];
      moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
    } else {
      const clonedItem = { ...event.previousContainer.data[event.previousIndex] };
      this.formFields = [...this.formFields, clonedItem]; // ✅ Immutable push
    }
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
          this.formFields = this.formFields.map((field, i) =>
            i === index ? { ...field, ...result } : field
          );
        }
      }
    });
  }

  deleteField(index: number) {
    this.formFields = this.formFields.filter((_, i) => i !== index);
  }  

  saveForm() {
    if (!this.formName) {
      alert("Please enter a form name before saving.");
      return;
    }
    if (!this.formFields.length) {
      alert("Please add at least one field before saving the form.");
      return;
    }

    const formTemplate: FormTemplate = {
      id: this.editingFormId || Math.floor(Math.random() * 100) + 1,
      name: this.formName,
      fields: this.formFields
    };

    if (this.editingFormId) {
      this.store.dispatch(FormTemplateActions.updateFormTemplate({
        formTemplate: {
          id: formTemplate.id,
          changes: formTemplate
        }
      }));
    } else {
      this.store.dispatch(FormTemplateActions.addFormTemplate({ formTemplate }));
    }

    alert(this.editingFormId ? 'Form Updated Successfully!' : 'Form Saved Successfully!');
    this.store.dispatch(FormTemplateActions.clearEditingFormTemplate());
    this.resetForm();
    this.router.navigate(['/dashboard']);
  }

  resetForm() {
    this.formFields = [];
    this.formName = "";
    this.editingFormId = null;
  }
}

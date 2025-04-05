import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-field-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './edit-field-dialog.component.html',
  styleUrl: './edit-field-dialog.component.css'
})
export class EditFieldDialogComponent implements OnInit{

  fieldConfigForm: FormGroup;
  fieldConfig = [
    { key: 'label', label: 'Field Label', type: 'text', required: true },
    { key: 'helpText', label: 'Help Text', type: 'text' },
    { key: 'required', label: 'Required', type: 'checkbox' },
    { key: 'minLength', label: 'Min Length', type: 'number', hideIfType: ['select', 'checkbox', 'radio'] },
    { key: 'maxLength', label: 'Max Length', type: 'number', hideIfType: ['select', 'checkbox', 'radio'] },
    { key: 'pattern', label: 'Pattern', type: 'text', hideIfType: ['select', 'checkbox', 'radio'] },
    { key: 'options', label: 'Options (comma-separated)', type: 'text', showIfType: ['select', 'checkbox', 'radio'] }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditFieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Receives data passed from the calling component
  ) {
    console.log("data from formField", data)
    this.fieldConfigForm = this.fb.group({
      label: [this.data.label, Validators.required],
      required: [this.data.required],
      helpText: [this.data.helpText],
      minLength: [this.data.validation?.minLength],
      maxLength: [this.data.validation?.maxLength],
      pattern: [this.data.validation?.pattern],
      options: [data.options?.join(', ')]
    });
  }

  ngOnInit(){
      if (['select', 'checkbox', 'radio'].includes(this.data.type)) {
        this.fieldConfigForm.addControl(
          'options',
          this.fb.control(this.data.options || [])
        );
      }
  }

  shouldShowField(field: any): boolean {
    const type = this.data.type;
    if (field.showIfType && !field.showIfType.includes(type)) return false;
    if (field.hideIfType && field.hideIfType.includes(type)) return false;
    return true;
  }
  

  saveFieldConfig() {
    if (this.fieldConfigForm.valid) {
      const result = this.fieldConfigForm.value;
      const updatedField = { 
        ...this.data,
        ...this.fieldConfigForm.value, 
        validation: {
          minLength: this.fieldConfigForm.value.minLength,
          maxLength: this.fieldConfigForm.value.maxLength,
          pattern: this.fieldConfigForm.value.pattern,
        }
      };
      if (['select', 'checkbox', 'radio'].includes(this.data.type)) {
        updatedField.options = result.options
          ? result.options.split(',').map((opt: string) => opt.trim()).filter(Boolean)
          : [];
      }
      this.dialogRef.close(updatedField); 
    } else {
      console.log("Form is invalid");
    }
  }

  // Cancel action to close the dialog without saving
  cancelEdit() {
    this.dialogRef.close();
  }
}

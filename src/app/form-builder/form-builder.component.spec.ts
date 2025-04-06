import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilderComponent } from './form-builder.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { selectEditingFormTemplate } from '../state/form-templates/form-template.selectors';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;
  let store: MockStore;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockTemplate = {
    id: 1,
    name: 'Test Form',
    fields: [{ type: 'text', label: 'Test Field', required: false, helpText: '' }]
  };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormBuilderComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectEditingFormTemplate, mockTemplate);

    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.editingFormId).toBe(1);
    expect(component.formName).toBe('Test Form');
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].label).toBe('Test Field');
  });

  it('should delete field by index', () => {
    component.formFields = [{ label: 'Field 1' }, { label: 'Field 2' }];
    component.deleteField(0);
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].label).toBe('Field 2');
  });

  it('should update existing field after editing', () => {
    const mockField = { label: 'Field 1', type: 'text' };
    const updatedField = { label: 'Field 1', type: 'textarea' };
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(updatedField)
    } as any);

    component.formFields = [mockField];
    component.editField(mockField);

    expect(component.formFields[0].type).toBe('textarea');
  });

  it('should save a new form', () => {
    spyOn(store, 'dispatch');
    component.editingFormId = null;
    component.formName = 'Test Form';
    component.formFields = [{ type: 'text', label: 'Test' }];
    component.saveForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Form Template] Add FormTemplate',
        formTemplate: jasmine.objectContaining({ name: 'Test Form' })
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should update an existing form', () => {
    spyOn(store, 'dispatch');
    component.editingFormId = 123;
    component.formName = 'Updated Form';
    component.formFields = [{ type: 'text', label: 'Updated' }];
    component.saveForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Form Template] Update FormTemplate',
        formTemplate: {
          id: 123,
          changes: jasmine.objectContaining({ name: 'Updated Form' })
        }
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not save if formName is empty', () => {
    spyOn(window, 'alert');
    component.formName = '';
    component.saveForm();
    expect(window.alert).toHaveBeenCalledWith('Please enter a form name before saving.');
  });

  it('should reset the form', () => {
    component.formName = 'Reset Test';
    component.formFields = [{ label: 'Old Field' }];
    component.editingFormId = 5;

    component.resetForm();

    expect(component.formName).toBe('');
    expect(component.formFields).toEqual([]);
    expect(component.editingFormId).toBeNull();
  });

  it('should add a new field on drop', () => {
    component.formFields = [];
    const event = {
      previousContainer: { data: [{ type: 'text', label: 'Test Field' }] },
      container: { data: [] },
      previousIndex: 0,
      currentIndex: 0
    } as any;

    component.drop(event);
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].label).toBe('Test Field');
  });

});

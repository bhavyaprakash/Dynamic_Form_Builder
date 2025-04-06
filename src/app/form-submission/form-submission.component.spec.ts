import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSubmissionComponent } from './form-submission.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FormSubmissionComponent', () => {
  let component: FormSubmissionComponent;
  let fixture: ComponentFixture<FormSubmissionComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockFormTemplate = {
    id: 1,
    name: 'Sample Form',
    fields: [
      { label: 'Name', type: 'text', required: true },
      { label: 'Age', type: 'text', required: false },
      { label: 'Accept Terms', type: 'checkbox', required: false }
    ]
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole']);
    authServiceSpy.getRole.and.returnValue('user');

    await TestBed.configureTestingModule({
      imports: [FormSubmissionComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

    // mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'loadedForm') return JSON.stringify(mockFormTemplate);
      return null;
    });
    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(FormSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with fields from localStorage', () => {
    expect(component.submissionForm).toBeDefined();
    expect(component.submissionForm.controls['Name']).toBeDefined();
    expect(component.submissionForm.controls['Age']).toBeDefined();
    expect(component.submissionForm.controls['Accept Terms']).toBeDefined();
  });

  it('should mark required fields as invalid if empty', () => {
    const nameControl = component.submissionForm.get('Name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
  });

  it('should submit form and save to localStorage', () => {
    spyOn(window, 'alert');
    component.submissionForm.get('Name')?.setValue('John Doe');
    component.submissionForm.get('Age')?.setValue('30');
    component.submissionForm.get('Accept Terms')?.setValue(true);

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should patch submitted values in view mode', () => {
    const viewTemplate = {
      ...mockFormTemplate,
      isViewMode: true,
      submittedValues: {
        'Name': 'Jane',
        'Age': '25',
        'Accept Terms': true
      }
    };

    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'loadedForm') return JSON.stringify(viewTemplate);
      return null;
    });

    fixture = TestBed.createComponent(FormSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isViewMode).toBeTrue();
    expect(component.submissionForm.get('Name')?.value).toBe('Jane');
    expect(component.submissionForm.get('Age')?.value).toBe('25');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormTemplateActions } from '../state/form-templates/form-templates.actions';
import { selectAllFormTemplates } from '../state/form-templates/form-template.selectors';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockTemplates = [
    { id: 1, name: 'Test Template', fields: [] },
    { id: 2, name: 'Another Template', fields: [] }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole', 'logout']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllFormTemplates, value: mockTemplates }
          ]
        }),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    authServiceSpy.getRole.and.returnValue('admin');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load form templates from store on init', () => {
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('Test Template');
  });

  it('should load submitted forms from localStorage', () => {
    const mockSubmissions = [{ id: 10, name: 'Submitted Form' }];
    localStorage.setItem('submittedForms', JSON.stringify(mockSubmissions));
    component.ngOnInit();
    expect(component.submittedDataSource.length).toBe(1);
  });

  it('should navigate to fill-form with form data on loadForm', () => {
    const form = mockTemplates[0];
    component.loadForm(form);
    expect(localStorage.getItem('loadedForm')).toContain(form.name);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fill-form']);
  });

  it('should dispatch setEditingFormTemplate and navigate to form-builder on editForm', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const form = mockTemplates[0];
    component.editForm(form);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FormTemplateActions.setEditingFormTemplate({ formTemplate: form })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form-builder']);
  });

  it('should dispatch deleteFormTemplate on deleteForm', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.deleteForm(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FormTemplateActions.deleteFormTemplate({ id: 1 })
    );
  });

  it('should delete submitted form from localStorage on deleteSubmitForm', () => {
    const mockSubmissions = [{ id: 1, name: 'Test' }, { id: 2, name: 'Keep' }];
    localStorage.setItem('submittedForms', JSON.stringify(mockSubmissions));

    component.deleteSubmitForm(1);
    const updated = JSON.parse(localStorage.getItem('submittedForms') || '[]');
    expect(updated.length).toBe(1);
    expect(updated[0].id).toBe(2);
    expect(component.submittedDataSource.length).toBe(1);
  });

  it('should navigate to /form-builder on goToFormBuilder', () => {
    component.goToFormBuilder();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form-builder']);
  });

  it('should logout and navigate to /login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

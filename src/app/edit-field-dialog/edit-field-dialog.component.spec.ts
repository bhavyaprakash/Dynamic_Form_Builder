import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFieldDialogComponent } from './edit-field-dialog.component';

describe('EditFieldDialogComponent', () => {
  let component: EditFieldDialogComponent;
  let fixture: ComponentFixture<EditFieldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFieldDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

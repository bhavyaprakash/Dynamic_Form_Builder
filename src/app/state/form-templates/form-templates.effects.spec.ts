import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FormTemplateEffects } from './form-templates.effects';

describe('FormTemplatesEffects', () => {
  let actions$: Observable<any>;
  let effects: FormTemplateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormTemplateEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(FormTemplateEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

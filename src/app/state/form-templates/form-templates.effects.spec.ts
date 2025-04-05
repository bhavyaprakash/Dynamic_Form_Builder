import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FormTemplatesEffects } from './form-templates.effects';

describe('FormTemplatesEffects', () => {
  let actions$: Observable<any>;
  let effects: FormTemplatesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormTemplatesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(FormTemplatesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

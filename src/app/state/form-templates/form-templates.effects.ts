import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormTemplateActions } from './form-templates.actions';
import { FormTemplate } from './form-templates.model'; 
import { FormTemplateService } from './form-templates.service';


@Injectable()
export class FormTemplateEffects {

  loadFormTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormTemplateActions.loadFormTemplates),
      concatMap(() =>
        this.formTemplateService.getAll().pipe(
          map(formTemplates =>
            FormTemplateActions.loadFormTemplatesSuccess({ formTemplates })
          ),
          catchError(error =>
            of(FormTemplateActions.loadFormTemplatesFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private formTemplateService: FormTemplateService
  ) {}
}

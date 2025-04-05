import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { FormTemplate } from './form-templates.model';


export const FormTemplateActions = createActionGroup({
  source: 'Form Template',
  events: {
    'Load FormTemplates': emptyProps(),
    'Load FormTemplates Success': props<{ formTemplates: FormTemplate[] }>(),
    'Load FormTemplates Failure': props<{ error: any }>(),
    'Add FormTemplate': props<{ formTemplate: FormTemplate }>(),
    'Upsert FormTemplate': props<{ formTemplate: FormTemplate }>(),
    'Add FormTemplates': props<{ formTemplates: FormTemplate[] }>(),
    'Upsert FormTemplates': props<{ formTemplates: FormTemplate[] }>(),
    'Update FormTemplate': props<{ formTemplate: Update<FormTemplate> }>(),
    'Update FormTemplates': props<{ formTemplates: Update<FormTemplate>[] }>(),
    'Delete FormTemplate': props<{ id: number }>(),
    'Delete FormTemplates': props<{ ids: string[] }>(),
    'Clear FormTemplates': emptyProps(),
  }
});

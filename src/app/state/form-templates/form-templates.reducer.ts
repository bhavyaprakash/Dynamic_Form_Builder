import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FormTemplate } from './form-templates.model';
import { FormTemplateActions } from './form-templates.actions';


export const formTemplatesFeatureKey = 'formTemplates';

export interface State extends EntityState<FormTemplate> {
  // additional entity state properties
}

export const adapter: EntityAdapter<FormTemplate> = createEntityAdapter<FormTemplate>();

export const initialState: State = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  on(FormTemplateActions.addFormTemplate,
    (state, { formTemplate }) => adapter.addOne(formTemplate, state)
  ),
  on(FormTemplateActions.upsertFormTemplate,
    (state, { formTemplate }) => adapter.upsertOne(formTemplate, state)
  ),
  on(FormTemplateActions.addFormTemplates,
    (state, { formTemplates }) => adapter.addMany(formTemplates, state)
  ),
  on(FormTemplateActions.upsertFormTemplates,
    (state, { formTemplates }) => adapter.upsertMany(formTemplates, state)
  ),
  on(FormTemplateActions.updateFormTemplate,
    (state, { formTemplate }) => adapter.updateOne(formTemplate, state)
  ),
  on(FormTemplateActions.updateFormTemplates,
    (state, { formTemplates }) => adapter.updateMany(formTemplates, state)
  ),
  on(FormTemplateActions.deleteFormTemplate,
    (state, { id }) => adapter.removeOne(id, state)
  ),
  on(FormTemplateActions.deleteFormTemplates,
    (state, { ids }) => adapter.removeMany(ids, state)
  ),
  on(FormTemplateActions.loadFormTemplatesSuccess, (state, { formTemplates }) =>
    adapter.setAll(formTemplates, state)
  ),
  on(FormTemplateActions.loadFormTemplatesFailure, (state, { error }) => {
    console.error('Failed to load form templates:', error);
    return state;
  }),
  
  on(FormTemplateActions.clearFormTemplates,
    state => adapter.removeAll(state)
  ),
);

export const formTemplatesFeature = createFeature({
  name: formTemplatesFeatureKey,
  reducer,
  extraSelectors: ({ selectFormTemplatesState }) => ({
    ...adapter.getSelectors(selectFormTemplatesState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = formTemplatesFeature;

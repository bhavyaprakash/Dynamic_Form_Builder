import { createSelector } from '@ngrx/store';
import { formTemplatesFeature } from './form-templates.reducer';

// Select all form templates
export const selectAllFormTemplates = formTemplatesFeature.selectAll;

// Optional: if you need other selectors
export const selectFormTemplateEntities = formTemplatesFeature.selectEntities;
export const selectFormTemplateIds = formTemplatesFeature.selectIds;
export const selectFormTemplateTotal = formTemplatesFeature.selectTotal;

export const selectEditingFormTemplate = createSelector(
    formTemplatesFeature.selectFormTemplatesState,
    (state) => state.editingFormTemplate
  );
  
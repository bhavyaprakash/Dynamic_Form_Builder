import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideEffects } from '@ngrx/effects';
import { FormTemplateEffects } from './state/form-templates/form-templates.effects';
import { formTemplatesFeature } from './state/form-templates/form-templates.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(), provideState(formTemplatesFeature),provideEffects(FormTemplateEffects), 
    provideHttpClient(), provideRouter(routes), provideClientHydration(), provideAnimationsAsync()]
};



// ------------------------------------------------------
// Configuración principal de la aplicación Angular standalone.
// Aquí registramos:
// - Router
// - Hydration (SSR opcional)
// - HttpClient + authInterceptor
// ------------------------------------------------------
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
  ],
};

import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, isDevMode, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { EventsEffects } from './events/data/events.effects';
import { eventsReducer } from './events/data/events.reducer';
import { EventSeedService } from './seeds/event-seed.service';

function initEventSeeding(): () => void {
  const seedService = inject(EventSeedService);
  return () => seedService.initSeed();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ events: eventsReducer }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([EventsEffects]),
    {
      provide: APP_INITIALIZER,
      useFactory: initEventSeeding,
      multi: true,
    },
  ],
};

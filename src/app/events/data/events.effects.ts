import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../services/event.service';
import {
  createEvent,
  createEventFailure,
  createEventSuccess,
  deleteEvent,
  deleteEventFailure,
  deleteEventSuccess,
  editEvent,
  editEventFailure,
  editEventSuccess,
  favoriteEvent,
  favoriteEventFailure,
  favoriteEventSuccess,
  loadEvents,
  loadEventsFailure,
  loadEventsSuccess,
  searchEvents,
  searchEventsFailure,
  searchEventsSuccess,
  registerEvent,
  registerEventFailure,
  registerEventSuccess,
} from './events.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsService = inject(EventService);

  loadEventsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadEvents),
      switchMap(() =>
        this.eventsService.getAll().pipe(
          map((events) => loadEventsSuccess({ events })),
          catchError((err) => of(loadEventsFailure({ error: err }))),
        ),
      ),
    );
  });

  createEventEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createEvent),
      switchMap((event) =>
        this.eventsService.create(event).pipe(
          map((event) => createEventSuccess({ event })),
          catchError((err) => of(createEventFailure({ error: err }))),
        ),
      ),
    );
  });

  deleteEventEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteEvent),
      switchMap(({ eventId }) =>
        this.eventsService.deleteEvent(eventId).pipe(
          map((deletedId) => deleteEventSuccess({ deletedId })),
          catchError((err) => of(deleteEventFailure({ error: err }))),
        ),
      ),
    );
  });

  favoriteEventEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(favoriteEvent),
      switchMap(({ id }) =>
        this.eventsService.favoriteEvent(id).pipe(
          map((N, F) => favoriteEventSuccess({ id: N.N, changes: { favorite: N.F } })),
          catchError((err) => of(favoriteEventFailure({ error: err }))),
        ),
      ),
    );
  });

  editEventEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editEvent),
      switchMap(({ id, ...changes }) =>
        this.eventsService.editEvent(id, changes).pipe(
          map((event) => editEventSuccess({ id: event.id, changes: event })),
          catchError((err) => of(editEventFailure({ error: err }))),
        ),
      ),
    );
  });

  searchEventsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchEvents),
      switchMap(({ searchTerm }) =>
        this.eventsService.searchEvents(searchTerm).pipe(
          map((events) => searchEventsSuccess({ searchTerm, events })),
          catchError((err) => of(searchEventsFailure({ error: err }))),
        ),
      ),
    );
  });

  registerEventEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerEvent),
      switchMap(({ id }) =>
        this.eventsService.registerEvent(id).pipe(
          map((event) =>
            event
              ? registerEventSuccess({ id: event.id, changes: { registered: event.registered } })
              : registerEventFailure({ error: 'Event not found' }),
          ),
          catchError((err) => of(registerEventFailure({ error: err }))),
        ),
      ),
    );
  });
}

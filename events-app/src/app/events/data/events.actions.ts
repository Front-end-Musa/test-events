import { EventISO } from './../../models/event.model';
import { createAction, props } from '@ngrx/store';

export const loadEvents = createAction('[Events API] Load Events');
export const loadEventsSuccess = createAction(
  '[Events API] Load Events Success',
  props<{ events: EventISO[] }>(),
);
export const loadEventsFailure = createAction(
  '[Events API] Load Events Failure',
  props<{ error: string }>(),
);

export const createEvent = createAction('[Events API] Create A New Event', props<EventISO>());
export const createEventSuccess = createAction(
  '[Events API] Create A New Event Success',
  props<{ event: EventISO }>(),
);
export const createEventFailure = createAction(
  '[Events API] Create A New Event Failure',
  props<{ error: string }>(),
);

export const deleteEvent = createAction('[Events API] Delete Event', props<{ eventId: number }>());
export const deleteEventSuccess = createAction(
  '[Events API] Delete Event Success',
  props<{ deletedId: number }>(),
);
export const deleteEventFailure = createAction(
  '[Events API] Delete Event Failure',
  props<{ error: string }>(),
);

export const favoriteEvent = createAction(
  '[Events API] Favorite An Event',
  props<{ id: number }>(),
);
export const favoriteEventSuccess = createAction(
  '[Events API] Favorite An Event Success',
  props<{ id: number; changes: Partial<EventISO> }>(),
);
export const favoriteEventFailure = createAction(
  '[Events API] Favorite An Event Failure',
  props<{ error: string }>(),
);

export const editEvent = createAction('[Events API] Edit An Event', props<EventISO>());
export const editEventSuccess = createAction(
  '[Events API] Edit An Event Success',
  props<{ id: number; changes: Partial<EventISO> }>(),
);
export const editEventFailure = createAction(
  '[Events API] Edit An Event Failure',
  props<{ error: string }>(),
);

export const searchEvents = createAction('[Events API] Search Events', props<{ searchTerm: string }>());
export const searchEventsSuccess = createAction('[Events API] Search Events Success', props<{ searchTerm: string; events: EventISO[] }>());
export const searchEventsFailure = createAction('[Events API] Search Events Failure', props<{ error: string }>());
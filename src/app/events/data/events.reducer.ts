import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EventISO } from '../../models/event.model';
import { createReducer, on } from '@ngrx/store';
import {
  createEvent,
  createEventFailure,
  createEventSuccess,
  deleteEvent,
  deleteEventSuccess,
  favoriteEvent,
  favoriteEventFailure,
  favoriteEventSuccess,
  loadEvents,
  loadEventsFailure,
  loadEventsSuccess,
  editEvent,
  editEventSuccess,
  editEventFailure,
  searchEventsFailure,
  searchEventsSuccess,
  searchEvents,
  registerEvent,
  registerEventSuccess,
  registerEventFailure,
} from './events.actions';

export interface EventsState extends EntityState<EventISO> {
  events: EventISO[];
  status: 'init' | 'loading' | 'loaded' | 'error';
  error: string | null;
}

export const eventsAdapter: EntityAdapter<EventISO> = createEntityAdapter<EventISO>({
  selectId: (event: EventISO) => event.id,
});

export const initialEventsState: EventsState = eventsAdapter.getInitialState({
  events: [],
  status: 'init',
  error: null,
});

export const eventsReducer = createReducer(
  initialEventsState,
  on(loadEvents, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(loadEventsSuccess, (state, { events }) =>
    eventsAdapter.setAll(events, { ...state, status: 'loaded', error: null }),
  ),
  on(loadEventsFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
  on(createEvent, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(createEventSuccess, (state, { event }) =>
    eventsAdapter.addOne(event, { ...state, status: 'loaded', error: null }),
  ),
  on(createEventFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
  on(deleteEvent, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(deleteEventSuccess, (state, { deletedId }) =>
    eventsAdapter.removeOne(deletedId, { ...state, status: 'loaded', error: null }),
  ),
  on(favoriteEvent, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(favoriteEventSuccess, (state, { id, changes }) => {
    const update = {
      id: id,
      changes: changes,
    };

    return eventsAdapter.updateOne(update, { ...state, status: 'loaded', error: null });
  }),
  on(favoriteEventFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
  on(registerEvent, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(registerEventSuccess, (state, { id, changes }) =>
    eventsAdapter.updateOne(
      { id, changes },
      { ...state, status: 'loaded', error: null },
    ),
  ),
  on(registerEventFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
  on(editEvent, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(editEventSuccess, (state, { id, changes }) =>
    eventsAdapter.updateOne(
      { id, changes },
      { ...state, status: 'loaded', error: null },
    ),
  ),
  on(editEventFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
  on(searchEvents, (state) => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(searchEventsSuccess, (state, { searchTerm, events }) =>
    eventsAdapter.setAll(events, { ...state, status: 'loaded', error: null }),
  ),
  on(searchEventsFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),
);

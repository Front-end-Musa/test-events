import { createFeatureSelector, createSelector } from '@ngrx/store';
import { eventsAdapter, EventsState } from './events.reducer';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const { selectIds, selectEntities, selectAll, selectTotal } =
  eventsAdapter.getSelectors(selectEventsState);

export const selectStatus = createSelector(selectEventsState, (state) => state.status);

export const selectFavorites = createSelector(selectAll, (events) =>
  events.filter((event) => event.favorite === true),
);

export const selectPlanned = createSelector(selectAll, (events) =>
  events.filter((event) => event.status === 'Planned'),
);

export const selectCompleted = createSelector(selectAll, (events) =>
  events.filter((event) => event.status === 'Completed'),
);

export const selectCanceled = createSelector(selectAll, (events) =>
  events.filter((event) => event.status === 'Canceled'),
);

export const selectConference = createSelector(selectAll, (events) =>
  events.filter((event) => event.category === 'Conference'),
);

export const selectWebinar = createSelector(selectAll, (events) =>
  events.filter((event) => event.category === 'Webinar'),
);

export const selectMeeting = createSelector(selectAll, (events) =>
  events.filter((event) => event.category === 'Meeting'),
);

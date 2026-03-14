import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectCanceled,
  selectCompleted,
  selectConference,
  selectMeeting,
  selectPlanned,
  selectStatus,
  selectWebinar,
} from './events.selectors';
import {
  createEvent,
  deleteEvent,
  editEvent,
  favoriteEvent,
  loadEvents,
  searchEvents,
  registerEvent,
} from './events.actions';
import { EventISO } from '../../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  store = inject(Store);
  allEvents$ = this.store.select(selectAll);
  status$ = this.store.select(selectStatus);
  filterPlanned$ = this.store.select(selectPlanned);
  filterCompleted$ = this.store.select(selectCompleted);
  filterCanceled$ = this.store.select(selectCanceled);
  filterConference$ = this.store.select(selectConference);
  filterWebinar$ = this.store.select(selectWebinar);
  filterMeetings$ = this.store.select(selectMeeting);

  loadEvents() {
    this.store.dispatch(loadEvents());
  }

  createEvent(newEvent: EventISO) {
    this.store.dispatch(createEvent(newEvent));
  }

  deleteEvent(id: number) {
    this.store.dispatch(deleteEvent({ eventId: id }));
  }

  favoriteEvent(itemId: number) {
    this.store.dispatch(favoriteEvent({ id: itemId }));
  }

  registerEvent(itemId: number) {
    this.store.dispatch(registerEvent({ id: itemId }));
  }

  editEvent(event: EventISO) {
    this.store.dispatch(editEvent(event));
  }

  searchEvents(searchTerm: string) {
    this.store.dispatch(searchEvents({ searchTerm }));
  }
}

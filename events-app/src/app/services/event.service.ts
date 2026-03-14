import { Injectable } from '@angular/core';
import { EventISO } from '../models/event.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventsSubject = new BehaviorSubject<EventISO[]>(this.loadFromLocalStorage());
  private events$ = this.eventsSubject.asObservable();

  private loadFromLocalStorage(): EventISO[] {
    const stored = localStorage.getItem('events');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  saveToLocalStorage(events: EventISO[]): void {
    localStorage.setItem('events', JSON.stringify(events));
    this.eventsSubject.next(events);
  }

  getAll(): Observable<EventISO[]> {
    this.loadFromLocalStorage();
    this.eventsSubject.next(this.loadFromLocalStorage());
    return this.events$;
  }

  getById(id: number): Observable<EventISO[]> {
    return this.events$.pipe(map((events) => events.filter((event) => event.id === id)));
  }

  create(newEventData: Omit<EventISO, 'id'>): Observable<EventISO> {
    const currentEvents = this.eventsSubject.value;
    const newEventId = Math.max(...currentEvents.map((e) => e.id), 0) + 1;
    const newEvent: EventISO = { ...newEventData, id: newEventId };
    const newEvents: EventISO[] = [...currentEvents, newEvent];
    this.eventsSubject.next(newEvents);
    this.saveToLocalStorage(newEvents);
    return of(newEvent);
  }

  editEvent(id: number, changes: Partial<EventISO>): Observable<EventISO> {
    const currentEvents: EventISO[] = this.eventsSubject.value;
    const currentEvent = currentEvents.find((event) => event.id === id);

    if (!currentEvent) {
      return of(null as unknown as EventISO);
    }

    const updatedEvent: EventISO = {
      ...currentEvent,
      ...changes,
    };

    const updatedEvents = currentEvents.map((event) =>
      event.id === id ? updatedEvent : event,
    );

    this.saveToLocalStorage(updatedEvents);

    return of(updatedEvent);
  }

  deleteEvent(deletedEventId: number) {
    const newEvents = this.eventsSubject.value.filter((event) => event.id !== deletedEventId);
    this.eventsSubject.next(newEvents);
    this.saveToLocalStorage(newEvents);
    return of(deletedEventId);
  }

  favoriteEvent(id: number): Observable<{ N: number; F: boolean }> {
    const currentEvents: EventISO[] = this.eventsSubject.value;
    const currentEvent: EventISO | undefined = currentEvents.find((event) => event.id === id);

    if (!currentEvent) {
      return of({ N: id, F: false });
    }

    const updatedEvent: EventISO = {
      ...currentEvent,
      favorite: !currentEvent.favorite,
    };

    const updatedEvents = currentEvents.map((event) => (event.id === id ? updatedEvent : event));

    this.eventsSubject.next(updatedEvents);
    this.saveToLocalStorage(updatedEvents);
    console.log(updatedEvents);

    return of({ N: id, F: updatedEvent.favorite });
  }

  searchEvents(searchTerm: string): Observable<EventISO[]> {
    return this.events$.pipe(
      map((events) =>
        events.filter((event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.status.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      ),
    );
  }
}

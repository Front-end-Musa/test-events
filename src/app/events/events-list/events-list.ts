import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EventISO } from '../../models/event.model';
import { EventsFacade } from '../data/events.facade';
import { EventCard } from './event-card/event-card';
import { EventCreate } from '../event-create/event-create';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-events-list',
  imports: [
    CommonModule,
    EventCard,
    EventCreate,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  templateUrl: './events-list.html',
  styleUrls: ['./events-list.scss'],
})
export class EventsList implements OnInit {
  private eventsFacade = inject(EventsFacade);
  events: EventISO[] = [];
  plannedEvents: EventISO[] = [];
  completedEvents: EventISO[] = [];
  canceledEvents: EventISO[] = [];
  conferenceEvents: EventISO[] = [];
  webinarEvents: EventISO[] = [];
  meetingEvents: EventISO[] = [];
  status: string = '';
  showCreateDialog = false;
  eventStatusTypes = ['Planned', 'Completed', 'Canceled'];
  eventCategoryTypes = ['Conference', 'Meeting', 'Webinar'];
  selectedStatusType: string | null = null;
  selectedCategoryType: string | null = null;
  filterOpen = false;
  sortMenuOpen = false;
  sortMode: 'title-asc' | 'title-desc' | 'date-desc' | 'date-asc' | null = null;
  editingEvent: EventISO | null = null;
  searchControl = new FormControl('');
  selectedTab: 'all' | 'registered' = 'all';

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  toggleSortMenu() {
    this.sortMenuOpen = !this.sortMenuOpen;
  }

  setSortMode(mode: 'title-asc' | 'title-desc' | 'date-desc' | 'date-asc') {
    this.sortMode = mode;
    this.sortMenuOpen = false;
  }

  ngOnInit(): void {
    this.eventsFacade.loadEvents();

    this.eventsFacade.allEvents$.subscribe((events) => {
      this.events = events;
      this.buildEventBuckets();
    });
    this.eventsFacade.status$.subscribe((status) => {
      this.status = status;
    });
    this.eventsFacade.filterPlanned$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    this.eventsFacade.filterCompleted$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    this.eventsFacade.filterCanceled$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    this.eventsFacade.filterConference$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    this.eventsFacade.filterWebinar$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    this.eventsFacade.filterMeetings$
      .subscribe((events) => {
        console.log(events);
      })
      .unsubscribe();
    
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm: string | null) => {
      if (searchTerm) {
        this.eventsFacade.searchEvents(searchTerm);
      } else {
        this.eventsFacade.loadEvents();
      }
    });
  }

  private buildEventBuckets() {
    this.eventsFacade.filterPlanned$.subscribe((events) => {
      this.plannedEvents = events;
    });
    this.eventsFacade.filterCompleted$.subscribe((events) => {
      this.completedEvents = events;
    });
    this.eventsFacade.filterCanceled$.subscribe((events) => {
      this.canceledEvents = events;
    });
    this.eventsFacade.filterConference$.subscribe((events) => {
      this.conferenceEvents = events;
    });
    this.eventsFacade.filterWebinar$.subscribe((events) => {
      this.webinarEvents = events;
    });
    this.eventsFacade.filterMeetings$.subscribe((events) => {
      this.meetingEvents = events;
    });
  }

  get eventsToShow(): EventISO[] {
    let base: EventISO[] =
      this.selectedTab === 'registered'
        ? this.events.filter((event) => event.registered)
        : this.events;

    if (this.selectedStatusType) {
      switch (this.selectedStatusType) {
        case 'Planned':
          base = this.plannedEvents;
          break;
        case 'Completed':
          base = this.completedEvents;
          break;
        case 'Canceled':
          base = this.canceledEvents;
          break;
      }
    }

    if (this.selectedCategoryType) {
      let categoryBase: EventISO[] = this.events;

      switch (this.selectedCategoryType) {
        case 'Conference':
          categoryBase = this.conferenceEvents;
          break;
        case 'Webinar':
          categoryBase = this.webinarEvents;
          break;
        case 'Meeting':
          categoryBase = this.meetingEvents;
          break;
      }

      if (this.selectedStatusType) {
        const categoryIds = new Set(categoryBase.map((event) => event.id));
        base = base.filter((event) => categoryIds.has(event.id));
      } else {
        base = categoryBase;
      }
    }

    // apply sort on a shallow copy so we don't mutate the original array
    const sorted = [...base];

    if (this.sortMode === 'title-asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortMode === 'title-desc') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (this.sortMode === 'date-desc') {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.sortMode === 'date-asc') {
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return sorted;
  }

  selectTab(tab: 'all' | 'registered') {
    this.selectedTab = tab;
  }

  selectStatus(statusType: string) {
    this.selectedStatusType = this.selectedStatusType === statusType ? null : statusType;
  }

  selectCategory(categoryType: string) {
    this.selectedCategoryType = this.selectedCategoryType === categoryType ? null : categoryType;
  }

  openCreateDialog() {
    this.editingEvent = null;
    this.showCreateDialog = true;
  }

  closeCreateDialog() {
    this.showCreateDialog = false;
    this.editingEvent = null;
  }

  addEvent(newEvent: EventISO) {
    this.events = [...this.events, newEvent];
    this.eventsFacade.createEvent(newEvent);
    this.closeCreateDialog();
  }

  editEvent(event: EventISO) {
    this.editingEvent = event;
    this.showCreateDialog = true;
  }

  updateEvent(edited: EventISO) {
    this.eventsFacade.editEvent(edited);
    this.closeCreateDialog();
  }
}

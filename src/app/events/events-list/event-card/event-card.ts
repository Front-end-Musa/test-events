import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EventISO } from '../../../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EventsFacade } from '../../data/events.facade';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, CommonModule],
  templateUrl: './event-card.html',
  styleUrls: ['./event-card.scss'],
})
export class EventCard {
  @Input({ required: true }) event!: EventISO;
  @Output() edit = new EventEmitter<EventISO>();
  private eventsFacade = inject(EventsFacade);

  isMenuOpen = false;

  get date(): Date {
    return this.event ? new Date(this.event.date) : new Date(0);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsFacade.deleteEvent(this.event.id);
      this.closeMenu();
    }
  }

  onEdit(): void {
    this.edit.emit(this.event);
    this.closeMenu();
  }

  favoriteItem() {
    this.eventsFacade.favoriteEvent(this.event.id);
  }
}

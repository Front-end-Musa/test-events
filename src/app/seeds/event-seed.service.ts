import { Injectable } from '@angular/core';
import { EventService } from '../services/event.service';
import { SEED_EVENTS } from './seed-events';
import { defaultSeedConfig } from './seed-config';

@Injectable({ providedIn: 'root' })
export class EventSeedService {
  constructor(private readonly eventService: EventService) {}

  initSeed(): void {
    if (!this.shouldSeed()) {
      return;
    }

    const stored = localStorage.getItem('events');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return;
        }
      } catch {
        // ignore parse errors and fall through to seeding
      }
    }

    this.eventService.saveToLocalStorage(SEED_EVENTS);
  }

  private shouldSeed(): boolean {
    return defaultSeedConfig.seedEvents;
  }
}


import { TestBed } from '@angular/core/testing';
import { EventSeedService } from './event-seed.service';
import { EventService } from '../services/event.service';
import { SEED_EVENTS } from './seed-events';

describe('EventSeedService', () => {
  let service: EventSeedService;
  let eventServiceSpy: jasmine.SpyObj<EventService>;

  beforeEach(() => {
    eventServiceSpy = jasmine.createSpyObj<EventService>('EventService', ['saveToLocalStorage']);

    TestBed.configureTestingModule({
      providers: [
        EventSeedService,
        { provide: EventService, useValue: eventServiceSpy },
      ],
    });

    service = TestBed.inject(EventSeedService);
  });

  afterEach(() => {
    localStorage.clear();
    jasmine.clock().uninstall();
  });

  it('should seed events when storage is empty in dev mode', () => {
    localStorage.removeItem('events');

    service.initSeed();

    expect(eventServiceSpy.saveToLocalStorage).toHaveBeenCalledWith(SEED_EVENTS);
  });

  it('should not seed when events already exist in storage', () => {
    localStorage.setItem('events', JSON.stringify([{ id: 99 }]));

    service.initSeed();

    expect(eventServiceSpy.saveToLocalStorage).not.toHaveBeenCalled();
  });
});


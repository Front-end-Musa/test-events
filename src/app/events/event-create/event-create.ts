import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventISO } from '../../models/event.model';
import { dateNotInPastValidator } from '../validators/date.validators';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.scss'],
})
export class EventCreate {
  @Input() eventToEdit?: EventISO;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() saveEvent = new EventEmitter<EventISO>();
  @Output() updateEvent = new EventEmitter<EventISO>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  categories = ['Conference', 'Webinar', 'Meeting'];
  statuses = ['Planned', 'Completed', 'Canceled'];
  timeOptions = this.buildTimeOptions(30);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      date: ['', [Validators.required, dateNotInPastValidator()]],
      time: ['09:00', Validators.required],
      category: ['Conference', Validators.required],
      status: ['Planned', Validators.required],
      favorite: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventToEdit'] && this.eventToEdit) {
      const event = this.eventToEdit;
      const { date, time } = this.extractDateAndTime(event.date);
      this.form.patchValue({
        title: event.title,
        description: event.description ?? '',
        date,
        time,
        category: event.category,
        status: event.status,
        favorite: event.favorite,
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const base: EventISO | undefined = this.eventToEdit;
    const localDateTime = `${value.date}T${value.time}`;

    const result: EventISO = {
      id: base ? base.id : Date.now(),
      title: value.title,
      description: value.description || undefined,
      date: new Date(localDateTime).toISOString(),
      category: value.category,
      status: value.status,
      favorite: value.favorite,
    };

    if (this.mode === 'edit' && base) {
      this.updateEvent.emit(result);
    } else {
      this.saveEvent.emit(result);
    }
    this.form.reset({
      title: '',
      description: '',
      date: '',
      time: '09:00',
      category: 'Conference',
      status: 'Planned',
      favorite: false,
    });
  }

  close() {
    this.cancel.emit();
  }

  private buildTimeOptions(stepMinutes: number): string[] {
    const options: string[] = [];

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += stepMinutes) {
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }

    return options;
  }

  private extractDateAndTime(value: string | undefined): { date: string; time: string } {
    if (!value) {
      return { date: '', time: '09:00' };
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { date: value, time: '09:00' };
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return { date: '', time: '09:00' };
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  }
}

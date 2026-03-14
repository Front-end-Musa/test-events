import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventISO } from '../../models/event.model';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      date: ['', Validators.required],
      category: ['Conference', Validators.required],
      status: ['Planned', Validators.required],
      favorite: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventToEdit'] && this.eventToEdit) {
      const event = this.eventToEdit;
      this.form.patchValue({
        title: event.title,
        description: event.description ?? '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
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

    const result: EventISO = {
      id: base ? base.id : Date.now(),
      title: value.title,
      description: value.description || undefined,
      date: new Date(value.date).toISOString(),
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
      category: 'Conference',
      status: 'Planned',
      favorite: false,
    });
  }

  close() {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactResponseData } from './types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-row',
  imports: [CommonModule],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css',
})
export class RowComponent {
  [x: string]: unknown;
  @Input() contact!: ContactResponseData;
  @Input() isGrid = false;
  @Output() toggleSelection = new EventEmitter<{
    contactId: number;
    checked: boolean;
  }>();

  constructor(private router: Router) {}

  onCheckboxChange(event: Event): void {
    event.stopPropagation();
    const checkbox = event.target as HTMLInputElement;
    this.toggleSelection.emit({
      contactId: this.contact.id,
      checked: checkbox.checked,
    });
  }
  selectContact(): void {
    this.router.navigate(['/contacts-details'], {
      state: { contact: this.contact },
    });
  }
}

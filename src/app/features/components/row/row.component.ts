import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  // [x: string]: unknown;
  @Input() contact!: ContactResponseData;
  @Input() isGrid = false;
  @Output() toggleSelection = new EventEmitter<{
    contactId: number;
    checked: boolean;
  }>();

  private apiUrl = 'http://localhost:8080/api/contacts/toggleIsFavorite';

  constructor(private router: Router, private http: HttpClient) {}

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

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    const url = `${this.apiUrl}/${this.contact.id}`;
    console.log('Calling URL:', url);
    
    this.http.post(url, {}).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.contact.isFavorite = !this.contact.isFavorite;
      },
      error: (error) => {
        console.error('Error details:', error);
      }
    });
}

}
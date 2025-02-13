import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../layout/contact.service';

@Component({
  selector: 'app-top-navbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css',
})
export class TopNavbarComponent implements OnInit {
  searchTerm = '';
  selectedContacts: number[] = [];
  contactCount = 0;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.fetchContactCount();
  }

  fetchContactCount(): void {
    this.isLoading = true;
    this.contactService.getContactCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.contactCount = response.data;
        } else {
          this.errorMessage = response.message; // Set the error message
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching contact count:', error);
        this.errorMessage = 'Failed to fetch contact count';
        this.isLoading = false;
      },
    });
  }

  @Output() searchEvent = new EventEmitter<string>();

  onSearchChange() {
    this.searchEvent.emit(this.searchTerm);
  }

  goToContactList(): void {
    this.router.navigate(['/add-contact']);
  }
}

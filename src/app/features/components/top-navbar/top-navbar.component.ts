import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../layout/contact.service';
import { ContactGroup } from '../../../enums/contactGroup.enum';

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
  selectedGroup: ContactGroup | null = null;
  availableGroups = Object.values(ContactGroup);
  visibleGroups = [ContactGroup.FRIENDS, ContactGroup.WORK, ContactGroup.MY_FAMILY, ContactGroup.CLIENTS];


  constructor(
    private router: Router,
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.fetchContactCount();
    this.setVisibleGroups();
  }

  fetchContactCount(): void {
    this.isLoading = true;
    this.contactService.getContactCount().subscribe({
      next: (response) => {
        console.log('Contact count response:', response); // Debugging line
        if (response.success) {
          this.contactCount = response.data;
        } else {
          this.errorMessage = response.message;
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
  
  setVisibleGroups(): void {
    this.visibleGroups = this.availableGroups.slice(0, 4); // Show only 4 groups on large screens
  }

  formatGroupName(group: ContactGroup): string {
    return group.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  @Output() searchEvent = new EventEmitter<string>();

  onSearchChange() {
    this.searchEvent.emit(this.searchTerm);
  }

  goToContactList(): void {
    this.router.navigate(['/add-contact']);
  }

}

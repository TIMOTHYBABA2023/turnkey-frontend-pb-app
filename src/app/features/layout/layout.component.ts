import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RowComponent } from '../components/row/row.component';
import { BottomNavbarComponent } from '../components/bottom-navbar/bottom-navbar.component';
import { TopNavbarComponent } from '../components/top-navbar/top-navbar.component';
import { ContactService } from './contact.service';
import { ContactResponseData } from '../components/row/types';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { DarkModeServiceService } from '../../core/services/dark-mode/dark-mode-service.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RowComponent,
    BottomNavbarComponent,
    TopNavbarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  activeTab: 'favorites' | 'contacts' = 'contacts';
  contacts: ContactResponseData[] = [];
  isListView = true;
  filteredContacts: ContactResponseData[] = [];
  selectedContactId: number | null = null;
  selectedContacts: number[] = [];

  constructor(
    private router: Router,
    private contactService: ContactService,
    private modalService: NgbModal,
    public darkModeServiceService: DarkModeServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load view preference from local storage
    const savedView = localStorage.getItem('viewPreference');
    if (savedView) {
      this.isListView = savedView === 'list';
    }
    this.fetchContacts();

  }

    // Filter contacts based on the active tab
    filterContacts(): void {
      if (this.activeTab === 'favorites') {
        this.filteredContacts = this.contacts.filter(contact => contact.isFavorite);
      } else {
        this.filteredContacts = this.contacts; 
      }
    }

  goToContactDetails() {
    this.router.navigate(['contacts-details']);
  }

  fetchContacts(): void {
    this.contactService.getContacts().subscribe((data) => {
      console.log('ITEMS COUNT ::: ' + data.data);
      this.contacts = data?.data?.content || [];
      this.filteredContacts = [...this.contacts];
    });
  }

  toggleSelection(event: { contactId: number; checked: boolean }): void {
    if (event.checked) {
      this.selectedContacts.push(event.contactId);
    } else {
      this.selectedContacts = this.selectedContacts.filter(
        (id) => id !== event.contactId,
      );
    }
  }

  bulkDelete() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.message = `Are you sure you want to delete ${this.selectedContacts.length} contact(s)?`;
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.contactService
            .bulkDeleteContacts(this.selectedContacts)
            .subscribe({
              next: () => {
                console.log('Contacts deleted successfully');
                this.refreshContactList();
                this.selectedContacts = [];
              },
              error: (error) => {
                console.error('Error deleting contacts:', error);
              },
            });
        }
      },
      (dismissReason) => {
        console.log('Modal dismissed:', dismissReason);
      },
    );
  }

  refreshContactList() {
    this.contactService.getContacts().subscribe({
      next: (response) => {
        this.filteredContacts = response.data.content;
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
      },
    });
  }

  toggleFavorite(): void {
    if (this.selectedContacts.length === 0) return;

    this.selectedContacts.forEach((contactId) => {
      this.contactService.toggleFavorite(contactId).subscribe(() => {
        this.fetchContacts();
      });
    });

    this.selectedContacts = [];
  }

  selectContact(id: number): void {
    this.selectedContactId = id;
  }
  onSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredContacts = [...this.contacts];
    } else {
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contact.phoneNumber.includes(searchTerm),
      );
    }
  }

  toggleView(): void {
    this.isListView = !this.isListView;
    // Save view preference to local storage
    localStorage.setItem('viewPreference', this.isListView ? 'list' : 'grid');
  }

  toggleDarkMode(): void {
    this.darkModeServiceService.toggleDarkMode();
  }

  // Export Contacts
  exportContacts() {
    const exportUrl = 'http://localhost:8080/api/contacts/export';
    this.http.get(exportUrl, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'contacts.csv'; // Change extension if needed
      a.click();
      window.URL.revokeObjectURL(a.href);
    });
  }

  // Import Contacts
  importContacts(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file: File = inputElement.files[0];
    const importUrl = 'http://localhost:8080/api/contacts/import';
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(importUrl, formData).subscribe({
      next: () => alert('Contacts imported successfully!'),
      error: (err) => alert(`Import failed: ${err.message}`)
    });

    // Reset the file input field
    this.fileInput.nativeElement.value = '';
  }

}

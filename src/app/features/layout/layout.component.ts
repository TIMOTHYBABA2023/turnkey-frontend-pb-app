import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RowComponent } from '../components/row/row.component';
import { BottomNavbarComponent } from '../components/bottom-navbar/bottom-navbar.component';
import { TopNavbarComponent } from '../components/top-navbar/top-navbar.component';
import { ContactService } from './contact.service';
import { ContactResponseData } from '../components/row/types';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

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
  contacts: ContactResponseData[] = [];
  isListView = true;
  filteredContacts: ContactResponseData[] = [];
  selectedContactId: number | null = null;
  selectedContacts: number[] = [];

  constructor(
    private router: Router,
    private contactService: ContactService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.fetchContacts();
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

  toggleView() {
    this.isListView = !this.isListView;
  }
}

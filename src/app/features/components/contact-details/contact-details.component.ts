import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ContactService } from '../../layout/contact.service';
import { ContactGroup } from '../../../enums/contactGroup.enum';
import { ContactResponseData } from '../row/types';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css',
})
export class ContactDetailsComponent implements OnInit, OnChanges {
  @Input() contactId!: number;
  contact?: ContactResponseData;
  contactForm!: FormGroup;
  contactGroups = Object.values(ContactGroup); //Check
  isEditable = false;
  backendError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contactService: ContactService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    console.log('Form after initialization:', this.contactForm.value);

    if (history.state.contact) {
      this.contact = history.state.contact;
      if (this.contact) {
        this.contactId = this.contact.id;
      }
      this.populateForm();
    } else if (this.contactId) {
      this.fetchContactDetail();
    } else {
      console.error('No contact data available');
      this.router.navigate(['/']);
    }
  }

  ngOnChanges(): void {
    if (
      this.contactId &&
      (!this.contact || this.contact.id !== this.contactId)
    ) {
      this.fetchContactDetail();
    }
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(0?[0-9]{10})$/)],
      ],
      mobileNumber: [''],
      workPhone: [''],
      contactGroup: [null],
      address: this.fb.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
    });
    this.contactForm.disable();
  }

  private fetchContactDetail(): void {
    this.contactService.getContactById(this.contactId).subscribe({
      next: (response) => {
        this.contact = response.data;
        this.populateForm();
      },
      error: (error) => {
        console.error('Error fetching contact:', error);
        this.backendError = 'Failed to load contact details';
      },
    });
  }

  private populateForm(): void {
    if (this.contact) {
      console.log('Contact data:', this.contact);
      console.log('Address data:', this.contact.address);

      this.contactForm.patchValue({
        firstName: this.contact.firstName,
        lastName: this.contact.lastName,
        email: this.contact.email,
        phoneNumber: this.contact.phoneNumber,
        mobileNumber: this.contact.mobileNumber,
        workPhone: this.contact.workPhone,
        contactGroup: this.contact.group,
        address: this.contact.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });

      console.log('Form value after patch:', this.contactForm.value);
    }
  }

  toggleVisibility(): void {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.contactForm.enable();
    } else {
      this.contactForm.disable();
      this.populateForm();
    }
  }

  onSubmit(): void {
    console.log('onSubmit() called');

    console.log(
      'Form data before validation: ',
      JSON.stringify(this.contactForm.value),
    );

    if (this.contactForm.invalid) {
      console.log('Form is invalid! Marking controls as touched.');
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const updatedContact = {
      ...this.contactForm.value,
      id: this.contactId,
    };

    console.log(
      'Final submitted data before API call: ',
      JSON.stringify(updatedContact),
    );

    this.contactService
      .updateContact(this.contactId, updatedContact)
      .subscribe({
        next: () => {
          console.log('API call successful!');
          this.toggleVisibility();
          this.fetchContactDetail();
        },
        error: (error) => {
          console.error('API error: ', error);
          this.backendError =
            error.error?.message || 'Failed to update contact';
        },
      });
  }

  cancel(): void {
    this.toggleVisibility();
  }

  goToContactList(): void {
    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactGroup } from '../../../enums/contactGroup.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-contact-component.component.html',
  styleUrls: ['./add-contact-component.component.css'],
})
export class AddContactComponentComponent {
  backendError = '';
  successMessage: string | null = null;
  contactForm: FormGroup;
  private apiUrl = 'http://localhost:8080/api/contacts';

  contactGroups = Object.values(ContactGroup);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
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
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);

    if (control?.hasError('required')) {
      return `${field.replace(/([A-Z])/g, ' $1')} is required!`;
    }
    if (control?.hasError('minlength')) {
      return `${field.replace(/([A-Z])/g, ' $1')} must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters!`;
    }
    if (control?.hasError('maxlength')) {
      return `${field.replace(/([A-Z])/g, ' $1')} must not exceed ${
        control.errors?.['maxlength'].requiredLength
      } characters!`;
    }
    if (control?.hasError('email')) {
      return 'Email is not in a valid format!';
    }
    if (control?.hasError('pattern')) {
      return 'Phone number must be 10 or 11 digits and may start with 0.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formValue = this.contactForm.value;
    const contactRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      mobileNumber: formValue.mobileNumber,
      workPhone: formValue.workPhone,
      contactGroup: formValue.group || null,
      address: {
        street: formValue.address.street,
        country: formValue.address.country,
        city: formValue.address.city,
        state: formValue.address.state,
        zipCode: formValue.address.zipCode,
      },
    };

    this.http.post(this.apiUrl, contactRequest).subscribe({
      next: () => {
        this.successMessage = 'Contact added successfully!';
        this.contactForm.reset();
      },
      error: (error) => {
        if (error.status === 409) {
          this.backendError = 'Contact already exists, change phone number.';
        } else if (error.error?.message) {
          this.backendError = error.error.message;
        } else {
          this.backendError = 'An error occurred while adding the contact';
        }
      },
    });
  }
  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  goToContactList(): void {
    this.router.navigate(['/']);
  }
}

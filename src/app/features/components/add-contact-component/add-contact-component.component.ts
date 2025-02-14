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
import { ModalService } from '../../../core/services/modal/modal.service';
import { ModalComponent } from '../../../modal/modal.component';

@Component({
  selector: 'app-add-contact-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, ModalComponent], 
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
    private modalService: ModalService
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
      contactGroup: formValue.contactGroup || null,
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
        this.modalService.show({
          message: 'Contact added successfully!',
          type: 'success'
        });
        this.contactForm.reset();
      },
      error: (error) => {
        let errorMessage = 'An error occurred while adding the contact';
            if (error.error?.message?.includes('duplicate key value violates unique constraint')) {
          if (error.error.message.includes('email')) {
            errorMessage = 'A contact with this email already exists.';
          } else if (error.error.message.includes('phone_number')) {
            errorMessage = 'A contact with this phone number already exists.';
          } else {
            errorMessage = 'This contact already exists in the system.';
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.modalService.show({
          message: errorMessage,
          type: 'error'
        });
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

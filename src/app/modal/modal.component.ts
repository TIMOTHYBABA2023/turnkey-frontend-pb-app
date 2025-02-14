import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../core/services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="modalService.modalConfig$ | async as config" class="modal-overlay">
      <div [ngClass]="['modal-content', config.type === 'success' ? 'success' : 'error']">
        <span class="message">{{ config.message }}</span>
        <button type="button" class="btn-close" aria-label="Close" (click)="modalService.hide()"></button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      animation: slideIn 0.3s ease-out;
    }

    .modal-content {
      padding: 1rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .message {
      margin-right: 1rem;
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      color: inherit;
      opacity: 0.5;
    }

    .btn-close:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}
}
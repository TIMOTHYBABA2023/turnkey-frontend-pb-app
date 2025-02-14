import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  [x: string]: any;

  private modalConfig = new BehaviorSubject<ModalConfig | null>(null);
  modalConfig$ = this.modalConfig.asObservable();

  show(config: ModalConfig): void {
    this.modalConfig.next(config);
    setTimeout(() => {
      this.hide();
    }, 10000); // 10 seconds timeout
  }

  hide(): void {
    this.modalConfig.next(null);
  }
}

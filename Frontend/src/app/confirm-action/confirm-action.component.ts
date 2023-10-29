import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.css']
})
export class ConfirmActionComponent {
  @Input() displayMessage: string;
  @Input() confirmButtonName: string;
  @Input() imageUrl?: string;
  @Output() deleteConfirmed: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteCancelled: EventEmitter<void> = new EventEmitter<void>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.displayMessage = data.displayMessage;
    this.confirmButtonName = data.confirmButtonName;
    this.imageUrl = data.imageUrl;
  }

  onDelete(): void {
    this.deleteConfirmed.emit();
  }

  onCancel(): void {
    this.deleteCancelled.emit();
  }
}

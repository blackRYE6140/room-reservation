import { Component, Inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  actionType: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actionType: string }
  ) {
    this.actionType = data.actionType;
  }

  confirmAction() {
    // Close the modal with the result of the action
    this.dialogRef.close(this.actionType.toLowerCase()); // Send 'update', 'delete', or 'add' as the result
  }

  cancel() {
    // Close the modal without saving changes
    this.dialogRef.close('cancel');
  }
}

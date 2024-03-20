import { Component, ElementRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionComponent } from 'src/app/confirm-action/confirm-action.component';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-property-card-small',
  templateUrl: './property-card-small.component.html',
  styleUrls: ['./property-card-small.component.css']
})
export class PropertyCardSmallComponent {
  @Input() property: IPropertyBase;
  imageLoaded: boolean = false;
  blurLoadBackgroundImage: string;

  constructor(
    private matDialog: MatDialog,
    private housingService: HousingService
  ) {}

  onImageLoad() {
    this.imageLoaded = true;
    setTimeout(() => {
      this.blurLoadBackgroundImage = '';
    }, 500);

  }

  confirmDelete(property: any) {
    const dialogRef = this.matDialog.open(ConfirmActionComponent, {
      width: '500px',
      data: {
        displayMessage: `Are you sure you want to remove your property listing in ${property.name}, ${property.city}?`,
        confirmButtonName: 'Yes',
        imageUrl: property.photo
      },
    })

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.housingService.deletePropertyEmitter.emit(this.property.id);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCancelled.subscribe(() => {
      dialogRef.close();
    })
  }

  ngOnInit() {
    this.blurLoadBackgroundImage = this.property.miniPhotoUrl;
  }

}

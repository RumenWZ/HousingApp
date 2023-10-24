import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Property } from 'src/app/model/property';
import { DateService } from 'src/app/services/date.service';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent {
  public propertyId: number;
  property = new Property();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  primaryPhotoUrl: string;

  postedSince: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService,
    private dateService: DateService) { }

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.housingService.getPropertyDetails(this.propertyId).subscribe((response: any) => {
      this.property = response;
      var postedDate = new Date(this.property.postedOn);
      this.postedSince = this.dateService.formatDateDifference(postedDate);
      console.log(this.property);
      this.primaryPhotoUrl = this.property.photos.find(p => p.isPrimary).photoUrl;

      this.galleryImages = this.property.photos.map(photo => {
        return {
          small: photo.photoUrl,
          medium: photo.photoUrl,
          big: photo.photoUrl
        };
      });
    });

    this.galleryOptions = [
      {
        width: '100%',
        height: '550px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
    ];
  }
}

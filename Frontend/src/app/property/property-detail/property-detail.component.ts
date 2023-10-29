import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { switchMap } from 'rxjs';
import { Property } from 'src/app/model/property';
import { DateService } from 'src/app/services/date.service';
import { HousingService } from 'src/app/services/housing.service';
import { UserService } from 'src/app/services/user.service';

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
  posterMobile: string;
  posterEmail: string;

  postedSince: string;

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private dateService: DateService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.housingService.getPropertyDetails(this.propertyId).pipe(switchMap((response: any) => {
      this.property = response;
      var postedDate = new Date(this.property.postedOn);
      this.postedSince = this.dateService.formatDateDifference(postedDate);
      this.primaryPhotoUrl = this.property.photos.find(p => p.isPrimary).photoUrl;

      this.galleryImages = this.property.photos.map(photo => {
        return {
          small: photo.photoUrl,
          medium: photo.photoUrl,
          big: photo.photoUrl
        };
      });
      return this.userService.getUserContactDetails(this.property.postedBy);
    })).subscribe((response: any) => {
      this.posterEmail = response.email;
      this.posterMobile = response.mobile;
    })



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

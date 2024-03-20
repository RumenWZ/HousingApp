import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  refreshGalleryFlag: boolean = true;

  screenWidthLessThan992px: boolean;
  screenWidthLessThan768px: boolean;
  screenWidthLessThan576px: boolean;
  screenWidthLessThan300px: boolean;

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private dateService: DateService,
    private userService: UserService,
    ) {
      this.screenWidthLessThan992px = window.innerWidth <= 992;
      this.screenWidthLessThan768px = window.innerWidth <= 768;
      this.screenWidthLessThan576px = window.innerWidth <= 576;
      this.screenWidthLessThan300px = window.innerWidth <= 300;
    }

  applyResponsiveOptions() {
    if (this.screenWidthLessThan992px) {
      this.galleryOptions[0].thumbnailsColumns = 3;
      this.galleryOptions[0].height = '500px'
    }if (this.screenWidthLessThan768px) {
      this.galleryOptions[0].thumbnailsColumns = 2;
      this.galleryOptions[0].height = '420px'
    }
    if (this.screenWidthLessThan576px) {
      this.galleryOptions[0].thumbnailsColumns = 3;
    }
    if (this.screenWidthLessThan300px) {
      this.galleryOptions[0].thumbnailsColumns = 2;
      this.galleryOptions[0].height = '330px'
    }
    if (!this.screenWidthLessThan992px) {
      this.galleryOptions[0].thumbnailsColumns = 4;
      this.galleryOptions[0].height = '550px';
    }

    this.refreshNgxGallery();
  }

  refreshNgxGallery() {
    this.refreshGalleryFlag = !this.refreshGalleryFlag;
    setTimeout(() => {
      this.refreshGalleryFlag = !this.refreshGalleryFlag;
    }, 1);
  }

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.housingService.getPropertyDetails(this.propertyId).pipe(switchMap((response: any) => {
      this.property = response;
      this.property.photos.sort((a: any, b: any) => a.photoIndex - b.photoIndex);
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
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnClick: true,
      },
    ];
    this.applyResponsiveOptions();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.screenWidthLessThan992px = window.innerWidth <= 992;
    this.screenWidthLessThan768px = window.innerWidth <= 768;
    this.screenWidthLessThan576px = window.innerWidth <= 576;
    this.screenWidthLessThan300px = window.innerWidth <= 300;
    this.applyResponsiveOptions();
  }

}

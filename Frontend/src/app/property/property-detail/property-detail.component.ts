import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Property } from 'src/app/model/property';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService) { }

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.route.data.subscribe(
      (data: any) => {
        this.property = data['prp'];
      }
    )

    // this.route.params.subscribe(
    //   (params) => {
    //     this.propertyId = +params['id'];
    //     this.housingService.getProperty(this.propertyId).subscribe(
    //       (data: any) => {
    //         this.property = data;
    //       }, error => {
    //         this.router.navigate(['/'])
    //       }
    //     );
    //   }
    // );

    this.galleryOptions = [
      {
        width: '100%',
        height: '550px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
    ];

    this.galleryImages = [
      {
        small: 'assets/images/interior-1.png',
        medium: 'assets/images/interior-1.png',
        big: 'assets/images/interior-1.png',
      },
      {
        small: 'assets/images/interior-2.png',
        medium: 'assets/images/interior-2.png',
        big: 'assets/images/interior-2.png',
      },
      {
        small: 'assets/images/interior-3.png',
        medium: 'assets/images/interior-3.png',
        big: 'assets/images/interior-3.png',
      },
      {
        small: 'assets/images/interior-4.png',
        medium: 'assets/images/interior-4.png',
        big: 'assets/images/interior-4.png',
      },
      {
        small: 'assets/images/interior-5.png',
        medium: 'assets/images/interior-5.png',
        big: 'assets/images/interior-5.png',
      },
    ];
  }
}

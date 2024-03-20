import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { IPropertyBase } from 'src/app/model/ipropertybase';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PropertyCardComponent {
  @Input() property : IPropertyBase;
  imageLoaded: boolean = false;
  backgroundImageUrl: string;

  onImageLoad() {
    setTimeout(() => {
      this.backgroundImageUrl = "";
    }, 600);
    this.imageLoaded = true;
  }

  ngOnInit() {
    this.backgroundImageUrl = this.property.miniPhotoUrl;
  }
}

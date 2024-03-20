import { Component, Input } from '@angular/core';
import { IPropertyBase } from 'src/app/model/ipropertybase';

@Component({
  selector: 'app-property-card-preview',
  templateUrl: './property-card-preview.component.html',
  styleUrls: ['./property-card-preview.component.css']
})
export class PropertyCardPreviewComponent {
  @Input() property : IPropertyBase;
}

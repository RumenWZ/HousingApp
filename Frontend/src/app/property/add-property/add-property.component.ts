import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  @ViewChild('formTabs') formTabs: TabsetComponent;

  addPropertyForm!: FormGroup;
  clickedNext: boolean;
  property = new Property();
  cityList: any[];

  propertyTypes: Array<string> = ['House', 'Apartment'];
  furnishingTypes: Array<string> = ['Fully', 'Partially', 'Unfurnished'];

  propertyView: IPropertyBase = {
    Id: null,
    Name: null,
    Price: null,
    SellOrRent: null,
    PType: null,
    FType: null,
    RTM: null,
    BHK: null,
    BuiltArea: null,
    City: ''
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private housingService: HousingService,
    private alertify: AlertifyService
    ) {}

  ngOnInit() {
    this.CreateAddPropertyForm();
    this.housingService.getAllCities().subscribe(data => {
      this.cityList = data;
      console.log(data);
    })
  }

  CreateAddPropertyForm() {
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
      SellOrRent: ['1', Validators.required],
      BHK: [null, Validators.required],
      FType: [null, Validators.required],
      PType: [null, Validators.required],
      Name: [null, Validators.required],
      City: [null, Validators.required],
      }),

      PriceInfo: this.fb.group({
        Price: [null, Validators.required],
        BuiltArea: [null, Validators.required],
        CarpetArea: [null],
        Maintenance: [null],
        Security: [null],
      }),

      AddressInfo: this.fb.group({
        FloorNo: [null],
        TotalFloors: [null],
        Address: [null, Validators.required],
        LandMark: [null]
      }),

      OtherInfo: this.fb.group({
        RTM: [null,Validators.required],
        PossessionOn: [null],
        AOP: [null],
        Gated: [null],
        MainEntrance: [null],
        Description: [null]
      })

    });
  }

  //#region Getter Methods
  //#region FormGroups

  get BasicInfo() {
    return this.addPropertyForm.controls.BasicInfo as FormGroup;
  }

  get PriceInfo() {
    return this.addPropertyForm.controls.PriceInfo as FormGroup;
  }

  get AddressInfo() {
    return this.addPropertyForm.controls.AddressInfo as FormGroup;
  }

  get OtherInfo() {
    return this.addPropertyForm.controls.OtherInfo as FormGroup;
  }
  //#endregion
  //#region FormControl
  get SellOrRent() {
    return this.BasicInfo.controls.SellOrRent as FormControl;
  }

  get BHK() {
    return this.BasicInfo.controls.BHK as FormControl;
  }

  get PType() {
    return this.BasicInfo.controls.PType as FormControl;
  }

  get FType() {
    return this.BasicInfo.controls.FType as FormControl;
  }

  get Name() {
    return this.BasicInfo.controls.Name as FormControl;
  }

  get City() {
    return this.BasicInfo.controls.City as FormControl;
  }

  get Price() {
    return this.PriceInfo.controls.Price as FormControl;
  }

  get BuiltArea() {
    return this.PriceInfo.controls.BuiltArea as FormControl;
  }

  get Address() {
    return this.AddressInfo.controls.Address as FormControl;
  }

  get RTM() {
    return this.OtherInfo.controls.RTM as FormControl;
  }

  get CarpetArea() {
    return this.PriceInfo.controls.CarpetArea as FormControl;
  }

  get LandMark() {
    return this.AddressInfo.controls.LandMark as FormControl;
  }

  get AOP() {
    return this.OtherInfo.controls.AOP as FormControl;
  }

  get FloorNo() {
    return this.AddressInfo.controls.FloorNo as FormControl;
  }

  get TotalFloors() {
    return this.AddressInfo.controls.TotalFloors as FormControl;
  }

  get MainEntrance() {
    return this.OtherInfo.controls.MainEntrance as FormControl;
  }

  get Security() {
    return this.PriceInfo.controls.Security as FormControl;
  }

  get Gated() {
    return this.OtherInfo.controls.Gated as FormControl;
  }

  get Maintenance() {
    return this.PriceInfo.controls.Maintenance as FormControl;
  }

  get PossessionOn() {
    return this.OtherInfo.controls.PossessionOn as FormControl;
  }

  get Description() {
    return this.OtherInfo.controls.Description as FormControl;
  }



  //#endregion
  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit(){
    console.log(this.Description);
    if (this.TabValidityChecker()) {
      this.mapProperty();
      this.housingService.addProperty(this.property);
      this.alertify.success('Property successfully listed on our website');

      if (this.SellOrRent.value === '2') {
        this.router.navigate(['/rent-property']);
      }else {
        this.router.navigate(['/']);
      }
    } else {
      this.alertify.error('Form is invalid, please review your entries');
    }

  }

  mapProperty(): void {
  this.property.Id = this.housingService.newPropID();
  this.property.SellOrRent = +this.SellOrRent.value;
  this.property.Name = this.Name.value;
  this.property.PType = this.PType.value;
  this.property.BHK = this.BHK.value;
  this.property.FType = this.FType.value;
  this.property.Price = this.Price.value;
  this.property.BuiltArea = this.BuiltArea.value;
  this.property.CarpetArea = this.CarpetArea.value;
  this.property.Address = this.Address.value;
  this.property.Address2 = this.LandMark.value;
  this.property.City = this.City.value;
  this.property.FloorNo = this.FloorNo.value;
  this.property.TotalFloors = this.TotalFloors.value;
  this.property.RTM = this.RTM.value;
  this.property.AOP = this.AOP.value;
  this.property.MainEntrance = this.MainEntrance.value;
  this.property.Security = this.Security.value;
  this.property.Gated = this.Gated.value;
  this.property.Maintenance = this.Maintenance.value;
  this.property.PossessionOn = this.PossessionOn.value;
  this.property.Description = this.Description.value;
  this.property.PostedOn = new Date().toString();
  }

  TabValidityChecker(): boolean {
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return false;
    }

    if (this.PriceInfo.invalid) {
      this.formTabs.tabs[1].active = true;
      return false;
    }

    if (this.AddressInfo.invalid) {
      this.formTabs.tabs[2].active = true;
      return false;
    }

    if (this.OtherInfo.invalid) {
      this.formTabs.tabs[3].active = true;
      return false;
    }
    return true;
  }

  selectTab(id: number, currentTabValid?: boolean) {
    this.clickedNext = true;
    console.log(this.Address);
    if (currentTabValid) {
      this.formTabs.tabs[id].active = true;
      this.clickedNext = false;
    }
  }
}

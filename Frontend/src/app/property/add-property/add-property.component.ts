import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { BasicPropertyOption, Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { switchMap } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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

  propertyTypes: Array<BasicPropertyOption>;
  furnishingTypes: Array<BasicPropertyOption>;

  photosSelectedPreview: any[] = [];
  photosSelected: File[] = [];
  newPropertyId: number;
  dragStartIndex: number;
  isUploading: boolean = false;

  regexOnlyLettersPattern = /^[a-zA-Z\s]*$/;
  regexWholeNumberPattern = /^[0-9]+$/;

  propertyView: IPropertyBase = {
    id: null,
    name: null,
    price: null,
    sellOrRent: null,
    propertyType: null,
    furnishingType: null,
    readyToMove: null,
    bhk: null,
    builtArea: null,
    city: '',
    image: null
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private housingService: HousingService,
    private alertify: AlertifyService,

    ) {

    }

  GetPropertyTypeOptions() {
    this.housingService.getPropertyTypes().subscribe((response: BasicPropertyOption[]) => {
      this.propertyTypes = response;
    });
  }

  GetFurnishingTypeOptions() {
    this.housingService.getFurnishingTypes().subscribe((response: BasicPropertyOption[]) => {
      this.furnishingTypes = response;
    });
  }

  cityChanged(){
    var cityId = this.City.value;
    var city = this.cityList.find(c => c.id == cityId);
    this.propertyView.city = city.name;
  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    const file = event.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024;

    if(this.photosSelected.length >= 6) {
      fileInput.value = '';
      return this.alertify.warning('You can upload a maximum of 6 photos per property');
    }

    if (this.photosSelected.some(selectedFile => selectedFile.name === file.name)) {
      fileInput.value = '';
      return this.alertify.warning(`An image with that file name is already selected`);
    }

    if (!allowedFormats.includes(file.type)) {
      fileInput.value = '';
      return this.alertify.error('Invalid file format. Only JPEG and PNG files are allowed');
    }

    if (file.size > maxSize) {
      fileInput.value = '';
      return this.alertify.error('File size exceeds the limit of 2 MB');
    }

    this.photosSelected.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      this.photosSelectedPreview.push({ url: imageUrl });
      this.updatePreviewPhoto();
    };
    reader.readAsDataURL(file);
    fileInput.value = '';

  }

  setPrimaryPhoto(index: number) {
    if (index == 0) {
      return;
    }
    var photoPreview = this.photosSelectedPreview.splice(index, 1)[0];
    var photoFile = this.photosSelected.splice(index, 1)[0];

    this.photosSelectedPreview.unshift(photoPreview);
    this.photosSelected.unshift(photoFile);
    this.updatePreviewPhoto();
  }

  updatePreviewPhoto() {
    if (this.photosSelectedPreview.length > 0) {
      this.propertyView.image = this.photosSelectedPreview[0].url;
    } else {
      this.propertyView.image = null;
    }
  }

  removeSelectedPhoto(index: number) {
    this.photosSelected.splice(index, 1);
    this.photosSelectedPreview.splice(index, 1);
    this.updatePreviewPhoto();
  }

  getPhotoURL(file: File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const photoURL = reader.result as string;
        resolve(photoURL);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  ngOnInit() {
    this.GetPropertyTypeOptions();
    this.CreateAddPropertyForm();
    this.GetFurnishingTypeOptions();
    this.housingService.getAllCities().subscribe(data => {
      this.cityList = data;
    });
  }

  CreateAddPropertyForm() {
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
      SellOrRent: ['1', Validators.required],
      BHK: [null, Validators.required],
      FType: [null, Validators.required],
      PType: [null, Validators.required],
      Name: [null, [Validators.required, Validators.pattern(this.regexOnlyLettersPattern), Validators.minLength(5), Validators.maxLength(30)]],
      City: ['', Validators.required],
      }),

      PriceInfo: this.fb.group({
        Price: [null, [Validators.required, Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(10)]],
        BuiltArea: [null, [Validators.required, Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(7)]],
        CarpetArea: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(20)]],
        Maintenance: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(20)]],
        Security: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(20)]],
      }),

      AddressInfo: this.fb.group({
        FloorNo: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(10)]],
        TotalFloors: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(10)]],
        Address: [null, [Validators.required, Validators.maxLength(100)]],
        LandMark: [null, [Validators.maxLength(100)]]
      }),

      OtherInfo: this.fb.group({
        RTM: [null,Validators.required],
        PossessionOn: [null, [this.isValidDateFormat]],
        Age: [null, [Validators.pattern(this.regexWholeNumberPattern), Validators.maxLength(4)]],
        Gated: [null],
        MainEntrance: [null, [Validators.maxLength(100)]],
        Description: [null, [Validators.maxLength(900)]]
      })

    });
  }

  isValidDateFormat(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const inputDate = new Date(control.value);

    if (isNaN(inputDate.getTime())) {
      return { invalidDate: true };
    }

    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1;
    const year = inputDate.getUTCFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

    if (!dateRegex.test(formattedDate)) {
      return { invalidDate: true };
    }
    return null;
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit(){
    if (this.photosSelected.length == 0) {
      return this.alertify.error('You must upload at least 1 photo for your property listing');
    }

    if (this.TabValidityChecker()) {
      this.mapProperty();
      const formData = new FormData();

      for (const file of this.photosSelected) {
        formData.append('photos', file);
      }
      this.isUploading = true;
      this.housingService.addProperty(this.property).pipe(switchMap((response: any) => {
        this.newPropertyId = response;

        return this.housingService.uploadPropertyPhotos(this.newPropertyId, formData);
      })
      ).subscribe((response: any) => {
        if (response == 201) {
          this.isUploading = false;
          this.alertify.success('Property uploaded successfully');

          if (this.SellOrRent.value === '2') {
            this.router.navigate(['/rent-property']);
          }else {
            this.router.navigate(['/']);
          }
        }
      });

    } else {
      this.alertify.error('Form is invalid, please review your entries');
    }
  }

  mapProperty(): void {
    this.property.sellOrRent = +this.SellOrRent.value;
    this.property.name = this.Name.value;
    this.property.propertyTypeId = this.PType.value;
    this.property.bhk = this.BHK.value;
    this.property.furnishingTypeId = this.FType.value;
    this.property.price = this.Price.value;
    this.property.builtArea = this.BuiltArea.value;
    this.property.carpetArea = this.CarpetArea.value;
    this.property.address = this.Address.value;
    this.property.address2 = this.LandMark.value;
    this.property.cityId = this.City.value;
    this.property.floorNo = this.FloorNo.value;
    this.property.totalFloors = this.TotalFloors.value;
    this.property.readyToMove = this.RTM.value;
    this.property.age = this.Age.value;
    this.property.mainEntrance = this.MainEntrance.value;
    this.property.security = this.Security.value;
    this.property.gated = this.Gated.value;
    this.property.maintenance = this.Maintenance.value;
    this.property.estPossessionOn = this.PossessionOn.value;
    this.property.description = this.Description.value;
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
    if (currentTabValid) {
      this.formTabs.tabs[id].active = true;
      this.clickedNext = false;
    }
  }
  //#region get form values
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

  get Age() {
    return this.OtherInfo.controls.Age as FormControl;
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

  dragStarted(index: number){
    this.dragStartIndex = index;
  }

  dropPhoto(event: CdkDragDrop<string[]>) {
    const previewImageEnd = document.elementFromPoint(event.dropPoint.x, event.dropPoint.y);
    const previewImageEndId = parseInt(previewImageEnd.getAttribute('id'), 10);

    if(isNaN(previewImageEndId)) {
      return;
    }

    const photoEnd = this.photosSelected[previewImageEndId];
    const photoEndPreview = this.photosSelectedPreview[previewImageEndId];

    const photoStart = this.photosSelected[this.dragStartIndex];
    const photoStartPreview = this.photosSelectedPreview[this.dragStartIndex];

    this.photosSelected[this.dragStartIndex] = photoEnd;
    this.photosSelectedPreview[this.dragStartIndex] = photoEndPreview;

    this.photosSelected[previewImageEndId] = photoStart;
    this.photosSelectedPreview[previewImageEndId]= photoStartPreview;
    this.updatePreviewPhoto()
  }
}



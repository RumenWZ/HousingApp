import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { switchMap } from 'rxjs';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { BasicPropertyOption, Property } from 'src/app/model/property';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent {
  @ViewChild('formTabs') formTabs: TabsetComponent;

  clickedNext: boolean;
  editPropertyForm: FormGroup;
  property: any;
  updatedProperty = new Property();
  cityList: any[];

  propertyTypes: Array<BasicPropertyOption>;
  furnishingTypes: Array<BasicPropertyOption>;

  photosSelectedPreview: any[] = [];
  photosSelected: File[] = [];
  newPropertyId: number;
  dragStartIndex: number;
  isUploading: boolean = false;

  pendingApiCallsCount: number = 0;

  initialPhotos: any[] = [];

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
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private housingService: HousingService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  CreateEditPropertyForm() {
    this.editPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
      SellOrRent: [null, Validators.required],
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

  onSubmit() {
    if (this.TabValidityChecker()) {
      if (this.photosSelected.length == 0) {
        return this.alertify.error('You must have least 1 photo for your property');
      }
      this.mapProperty();
      this.housingService.updatePropertyDetails(this.property.id, this.updatedProperty)
      .pipe(
        switchMap(async () => this.processPhotosForSubmit()),
      )
      .subscribe(() => {
      });
    }

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
    if (this.pendingApiCallsCount > 0) {
      return;
    }
    this.clickedNext = true;
    if (currentTabValid) {
      this.formTabs.tabs[id].active = true;
      this.clickedNext = false;
    }
  }

  assignFormValues() {
    this.editPropertyForm.patchValue({
      BasicInfo: {
        SellOrRent: this.property.sellOrRent,
        BHK: this.property.bhk,
        PType: this.property.propertyTypeId,
        FType: this.property.furnishingTypeId,
        Name: this.property.name,
        City: this.property.cityId,
      },
      PriceInfo: {
        Price: this.property.price,
        BuiltArea: this.property.builtArea,
        CarpetArea: this.property.carpetArea,
        Maintenance: this.property.maintenance,
        Security: this.property.security,
      },
      AddressInfo: {
        FloorNo: this.property.floorNo,
        TotalFloors: this.property.totalFloors,
        Address: this.property.address,
        LandMark: this.property.address2,
      },
      OtherInfo: {
        RTM: this.property.readyToMove ? 'true' : 'false',
        PossessionOn: this.property.estPossessionOn,
        Age: this.property.age,
        Gated: this.property.gated ? 'true': 'false',
        MainEntrance: this.property.mainEntrance,
        Description: this.property.description,
      },
    });
    this.propertyView = {
      id: null,
      name: this.property.name,
      price: this.property.price,
      sellOrRent: this.property.sellOrRent.toString(),
      propertyType: this.property.propertyType.name,
      furnishingType: this.property.furnishingType.name,
      readyToMove: this.property.readyToMove,
      bhk: this.property.bhk,
      builtArea: this.property.builtArea,
      city: this.property.city.name,
      image: null
    };

    const primaryPhoto = this.property.photos.find((photo: any) => photo.isPrimary);
    if (primaryPhoto) {
      this.propertyView.image = primaryPhoto.photoUrl;
    }
  }

  processPhotosForSubmit() {
    this.photosSelected.forEach((photo: any, i) => {
      if (photo instanceof File) {
        var formData = new FormData();
        formData.append('photo', photo);
        this.pendingApiCallsCount++;
        this.housingService.uploadPropertyPhoto(this.property.id, i, formData).subscribe((response: any) => {
          if (response == 201) {
            this.pendingApiCallsCount--;
            this.deleteOldPhotos();
          }
        });
      } else {
        this.pendingApiCallsCount++;
        this.initialPhotos = this.initialPhotos.filter(p => p !== photo);
        this.housingService.updatePhotoIndex(this.property.id, photo.id, i).subscribe((response: any) => {
          if (response == 201) {
            this.pendingApiCallsCount--;
            this.deleteOldPhotos();
          }
        });
      }
    });
    this.tryRedirectAfterSuccess();
  }

  deleteOldPhotos() {
    if (this.pendingApiCallsCount != 0) {
      return;
    }
    if (this.initialPhotos.length == 0) {
      this.tryRedirectAfterSuccess();
    }
    this.initialPhotos.forEach(photo => {
      this.pendingApiCallsCount++;
      this.housingService.deletePropertyPhoto(this.property.id, photo.id).subscribe((response: any) => {
        if (response == 201) {
          this.pendingApiCallsCount--;
          this.tryRedirectAfterSuccess();
        }
      });
    })
  }

  tryRedirectAfterSuccess() {
    if (this.pendingApiCallsCount != 0) {
      return;
    }
    this.router.navigate(['/user/my-profile']);
    this.alertify.success('Property updated successfully');
  }

  ngOnInit() {
    this.GetFurnishingTypeOptions();
    this.GetPropertyTypeOptions();
    this.CreateEditPropertyForm();
    this.housingService.getAllCities().subscribe(data => {
      this.cityList = data;
    });
    var propertyId = Number(this.route.snapshot.params['id']);
    this.housingService.getFullPropertyDetails(propertyId).subscribe((response: any) => {
      response.photos.sort((a: any, b: any) => a.photoIndex - b.photoIndex);
      this.property = response;
      console.log(this.property);
      this.initialPhotos = this.property.photos;
      for (const photo of this.property.photos) {
        this.photosSelectedPreview.push({url : photo.photoUrl});
        this.photosSelected.push(photo);
      }
      this.assignFormValues();
    });

  }

  mapProperty(): void {
    this.updatedProperty.sellOrRent = +this.SellOrRent.value;
    this.updatedProperty.name = this.Name.value;
    this.updatedProperty.propertyTypeId = this.PType.value;
    this.updatedProperty.bhk = this.BHK.value;
    this.updatedProperty.furnishingTypeId = this.FType.value;
    this.updatedProperty.price = this.Price.value;
    this.updatedProperty.builtArea = this.BuiltArea.value;
    this.updatedProperty.carpetArea = this.CarpetArea.value;
    this.updatedProperty.address = this.Address.value;
    this.updatedProperty.address2 = this.LandMark.value;
    this.updatedProperty.cityId = this.City.value;
    this.updatedProperty.floorNo = this.FloorNo.value;
    this.updatedProperty.totalFloors = this.TotalFloors.value;
    this.updatedProperty.readyToMove = this.RTM.value;
    this.updatedProperty.age = this.Age.value;
    this.updatedProperty.mainEntrance = this.MainEntrance.value;
    this.updatedProperty.security = this.Security.value;
    this.updatedProperty.gated = this.Gated.value;
    this.updatedProperty.maintenance = this.Maintenance.value;
    this.updatedProperty.estPossessionOn = this.PossessionOn.value;
    this.updatedProperty.description = this.Description.value;
  }

  //#region get form values
  get BasicInfo() {
    return this.editPropertyForm.controls.BasicInfo as FormGroup;
  }

  get PriceInfo() {
    return this.editPropertyForm.controls.PriceInfo as FormGroup;
  }

  get AddressInfo() {
    return this.editPropertyForm.controls.AddressInfo as FormGroup;
  }

  get OtherInfo() {
    return this.editPropertyForm.controls.OtherInfo as FormGroup;
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

  cityChanged(){
    var cityId = this.City.value;
    var city = this.cityList.find(c => c.id == cityId);
    this.propertyView.city = city.name;
  }

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

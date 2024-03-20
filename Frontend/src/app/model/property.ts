import { IPropertyBase } from "./ipropertybase";

export class Property implements IPropertyBase{
  id: number;
  sellOrRent: number;
  name: string;
  propertyTypeId: number;
  propertyType: string;
  bhk: number;
  furnishingType: string;
  furnishingTypeId: string;
  price: number;
  builtArea: number;
  carpetArea?: number;
  address: string;
  address2?: string;
  city: string;
  cityId: number;
  floorNo?: string;
  totalFloors?: string;
  readyToMove: boolean;
  age?: string;
  mainEntrance?: string;
  security?: number;
  gated?: boolean;
  maintenance?: number;
  estPossessionOn?: Date;
  image?: string;
  description?: string;
  postedOn: Date
  photo: string;
  photos: any[];
  postedBy: number;
  miniPhotoUrl: string;
}

export class BasicPropertyOption {
  id: number;
  name: string;
}



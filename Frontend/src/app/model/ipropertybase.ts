export interface IPropertyBase {
  id: number,
  sellOrRent: number;
  name: string;
  propertyType: string;
  furnishingType: string;
  price: number;
  bhk: number;
  builtArea: number;
  city: string;
  readyToMove: boolean;
  image?: string;
  photo?:string;
  miniPhotoUrl?: string;
}

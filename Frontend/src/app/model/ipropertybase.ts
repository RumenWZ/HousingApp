export interface IPropertyBase {
  Id: number,
  SellOrRent: number;
  Name: string;
  PType: string;
  FType: string;
  Price: number;
  BHK: number;
  BuiltArea: number;
  City: string;
  RTM: boolean;
  Image?: string;
}

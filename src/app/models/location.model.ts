export interface Country{
  countryid: string;
  name: string;
  region: Region[];
}

export interface Region{
  regionId: string;
  name: string;
  mapurl: string;
  spot: Spot[];
}

export interface Spot{
  address: string;
  caption: string;
  imageurl: string;
  mapurl: string;
  name: string;
  spotid: string;
  rate: Rate[];
}

export interface Rate{
  rating: number;
  uid: string;
}

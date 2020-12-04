export interface Country{
  key: string;
  name: string;
}

export interface Region{
  key: string;
  countryid: string;
  name: string;
  mapurl: string;
  lat: string;
  long: string;
}

export interface Spot{
  key: string;
  address: string;
  caption: string;
  imageurl: string;
  mapurl: string;
  name: string;
  regionid: string;
}

export interface Rate{
  key: string;
  rating: number;
  spotid: string;
  uid: string;
}

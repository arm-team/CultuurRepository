export interface Country{
  name: string;
  region: Region[];
}

export interface Region{
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
  rate: Rate[];
}

export interface Rate{
  rating: number;
  uid: string;
}

export interface Post{
  key: string;
  caption: string;
  imageurl: string;
  regionid: string;
  spotid: string;
  tag: string;
  uid: string;
  comment: Comment[];
  dislike: Dislike[];
  like: Like[];
}

export interface Comment{
    content: string;
    uid: string;
}

export interface Dislike{
    uid: string;
}

export interface Like{
    uid: string;
}

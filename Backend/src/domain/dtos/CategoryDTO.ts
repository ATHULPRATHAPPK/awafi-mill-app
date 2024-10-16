export interface categoryCreationDTo {
  name: string;
  description: string;
}
export interface categoryDTo {
  _id:string,
  name: string;
  description: string;
  isListed: string;
  isDeleted: string;
  createdAt: Date;
  updatedAt: Date;
}

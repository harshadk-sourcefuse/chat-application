

export type UserDTO = {
  clientId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};
export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface Profile {
  id: string;
  displayName: string;
  name: Name;
  emails?: (EmailsEntity)[] | null;
  photos?: (PhotosEntity)[] | null;
  provider: string;
  _raw: string;
  _json: Json;
}
export interface Name {
  familyName: string;
  givenName: string;
}
export interface EmailsEntity {
  value: string;
  verified: boolean;
}
export interface PhotosEntity {
  value: string;
}
export interface Json {
  [key: string]: string | boolean
}



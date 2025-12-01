export type User = {
  id: string;
  uuid: string;
  username: string;
  email: string;
  roles: string[];
  countryCode: string;
  mobile: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string;
  birthdate: string | null;
}
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  imageUrl?: string | null;
  email: string;
  roles: string[];
}

export interface RegistrationRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface RegistrationResponse {
  statusToken: string;
  username: string;
}

export enum RegistrationState {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface RegistrationStatusRequest {
  token: string;
}

export interface RegistrationStatusResponse {
  state: RegistrationState;
  errorMessage?: string;
}

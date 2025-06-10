import axios, { AxiosInstance } from "axios";
import { SERVICE_URLS } from "../configs";

const defaultValidateStatus = (status: number) => status >= 200 && status < 300;

export const authApi = axios.create({
  baseURL: SERVICE_URLS.AUTH,
  validateStatus: (status) => defaultValidateStatus(status),
});

export const profileApi = axios.create({
  baseURL: SERVICE_URLS.PROFILE,
  validateStatus: (status) => defaultValidateStatus(status),
});

export const learningApi = axios.create({
  baseURL: SERVICE_URLS.LEARNING,
  validateStatus: (status) => defaultValidateStatus(status),
});

export const paymentApi = axios.create({
  baseURL: SERVICE_URLS.PAYMENT,
  validateStatus: (status) => defaultValidateStatus(status),
});

export const authenticatedApis: AxiosInstance[] = [
  profileApi,
  learningApi,
  paymentApi,
];

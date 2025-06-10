import { env } from "./env";

interface ServiceUrls {
  AUTH: string;
  PROFILE: string;
  LEARNING: string;
  SCHEDULING: string;
  CHAT: string;
  PAYMENT: string;
}

export const SERVICE_URLS: ServiceUrls = {
  AUTH:
    env.REACT_APP_AUTH_SERVICE_URL ||
    env.VITE_AUTH_SERVICE_URL ||
    "http://localhost:8081",
  PROFILE:
    env.REACT_APP_PROFILE_SERVICE_URL ||
    env.VITE_PROFILE_SERVICE_URL ||
    "http://localhost:8082",
  LEARNING:
    env.REACT_APP_LEARNING_SERVICE_URL ||
    env.VITE_LEARNING_SERVICE_URL ||
    "http://localhost:8083",
  SCHEDULING:
    env.REACT_APP_SCHEDULING_SERVICE_URL ||
    env.VITE_SCHEDULING_SERVICE_URL ||
    "http://localhost:8084",
  CHAT:
    env.REACT_APP_CHAT_SERVICE_URL ||
    env.VITE_CHAT_SERVICE_URL ||
    "http://localhost:8085",
  PAYMENT:
    env.REACT_APP_PAYMENT_SERVICE_URL ||
    env.VITE_PAYMENT_SERVICE_URL ||
    "http://localhost:8086",
};

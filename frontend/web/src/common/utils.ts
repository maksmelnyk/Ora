import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
  ValidationError,
} from "./errors/AppError";
import axios, { AxiosError } from "axios";
import { iso6393 } from "iso-639-3";
import { Language } from "./types/language";
import { POPULAR_LANGUAGE_CODES } from "./constants/language";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceLabel = (value: number): string => {
  return `$${value}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:00`;
  }
  return `${mins}:00`;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatCounter = (ratingCount: number): string => {
  if (ratingCount >= 1000) {
    return (ratingCount / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  return ratingCount.toString();
};

export const parseAxiosError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      code?: string;
      message?: string;
      details?: any;
    }>;
    const status = axiosError.response?.status;
    const code = axiosError.response?.data?.code as string;
    const message = axiosError.response?.data?.message ?? "An error occurred";
    const details = axiosError.response?.data?.details;

    switch (status) {
      case 401:
        return new UnauthorizedError(message, code);
      case 403:
        return new ForbiddenError(message, code);
      case 404:
        return new NotFoundError(message, code);
      case 409:
        return new ConflictError(message, code);
      case 422:
        if (details) {
          return new ValidationError(message, code, details);
        }
        return new UnprocessableEntityError(message, code);
      default:
        return new InternalError(message, code);
    }
  }

  return new InternalError("An unexpected error occurred.", "UNKNOWN");
};

export const getLanguages = (): Language[] => {
  return iso6393
    .filter(
      (lang) =>
        lang.type === "living" &&
        lang.name &&
        lang.iso6393 &&
        lang.iso6393.length === 3
    )
    .map((lang) => ({
      name: lang.name,
      code: lang.iso6393,
      nativeName: lang.name,
      type: lang.type as Language["type"],
    }))
    .sort((a, b) => {
      const aIsPopular = POPULAR_LANGUAGE_CODES.includes(a.code);
      const bIsPopular = POPULAR_LANGUAGE_CODES.includes(b.code);

      if (aIsPopular && !bIsPopular) return -1;
      if (!aIsPopular && bIsPopular) return 1;
      if (aIsPopular && bIsPopular) {
        return (
          POPULAR_LANGUAGE_CODES.indexOf(a.code) -
          POPULAR_LANGUAGE_CODES.indexOf(b.code)
        );
      }

      return a.name.localeCompare(b.name);
    });
};

export const getLanguageNameFromIsoCode = (
  code: string
): string | undefined => {
  const lang = iso6393.find(
    (lang) => lang.type === "living" && lang.name && lang.iso6393 === code
  );

  return lang?.name;
};

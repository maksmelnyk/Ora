export interface EducatorSummaryResponse {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  bio: string;
  rating: number;
  studentCount: number;
  productCount: number;
  isBookmarked?: boolean;
}

export interface UpdateEducatorProfileRequest {
  bio: string;
  experience: string;
  videoUrl: string;
}

export enum ApplicationStep {
  INTRO = 1,
  APPLICATION_FORM = 2,
}

export interface FAQItem {
  icon: string;
  title: string;
  description: string;
}

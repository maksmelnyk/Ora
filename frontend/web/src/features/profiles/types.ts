export interface ProfileDetailsResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  imageUrl?: string | null;
  educator: ProfileEducatorDetailsResponse;
}

export interface ProfileEducatorDetailsResponse {
  bio: string;
  experience: string;
  videoUrl: string;
  rating: number;
  studentCount: number;
  productCount: number;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string | null;
  imageUrl?: string | null;
}

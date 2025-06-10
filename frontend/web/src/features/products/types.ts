export interface ProductPreviewResponse {
  id: string;
  title: string;
  type: ProductType;
  price?: number;
  imageUrl: string;
  educator: EducatorResponse;
}

export interface ProductSummaryResponse {
  id: string;
  subCategoryId: string;
  educatorId: string;
  type: ProductType;
  status: ProductStatus;
  level: ProductLevel;
  title: string;
  description: string;
  language: string;
  imageUrl: string;
  price: number;
  rating: number;
  ratingCount: number;
  isBookmarked?: boolean;
  durationMin?: number;
  maxParticipants?: number;
  startDate?: Date;
  endDate?: Date;
  educator: EducatorResponse;
}

export interface ProductDetailsResponse {
  id: string;
  subCategoryId: string;
  type: ProductType;
  status: ProductStatus;
  level: ProductLevel;
  title: string;
  objectives: string;
  description: string;
  highlights: string;
  audience: string;
  requirements: string;
  language: string;
  imageUrl: string;
  videoUrl: string;
  price: number;
  rating: number;
  ratingCount: number;
  isBookmarked?: boolean;
  durationMin?: number;
  maxParticipants?: number;
  startDate?: Date;
  endDate?: Date;
  educator: EducatorResponse;
  modules: ModuleResponse[];
}

export interface ModuleResponse {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  lessons: LessonResponse[];
}

export interface LessonResponse {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  durationMin: number;
}

export interface EducatorResponse {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface ProductFilters {
  title?: string;
  educatorId?: string;
  type?: ProductType;
  level?: ProductLevel;
  language?: string;
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  subCategories: SubCategoryResponse[];
}

export interface SubCategoryResponse {
  id: string;
  name: string;
}

export interface ProductCreateRequest {
  type: ProductType;
  level: ProductLevel;
  subCategoryId: string;
  title: string;
  objectives: string;
  description: string;
  highlights: string;
  audience: string;
  requirements: string;
  language: string;
  imageUrl?: string;
  videoUrl?: string;
  price: number;
  durationMin?: number;
  maxParticipants?: number;
  modules?: ModuleCreateRequest[];
}

export interface ModuleCreateRequest {
  title: string;
  description: string;
  sortOrder: number;
  lessons: LessonCreateRequest[];
}

export interface LessonCreateRequest {
  title: string;
  description?: string | null;
  sortOrder: number;
  durationMin: number;
}

export enum ProductType {
  PrivateSession = 0,
  GroupSession = 1,
  OnlineCourse = 2,
  PreRecordedCourse = 3,
}

export enum ProductStatus {
  Active = 0,
  Inactive = 1,
  Moderation = 2,
}

export enum ProductLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3,
}

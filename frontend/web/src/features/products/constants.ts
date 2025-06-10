import { ProductLevel, ProductType } from "./types";

export const PRODUCT_TYPE_CONFIG = {
  [ProductType.PreRecordedCourse]: {
    label: "Courses",
    value: ProductType.PreRecordedCourse.toString(),
    displayName: "Pre-recorded Courses",
    description: "Self-paced learning with recorded content",
    sortOrder: 1,
  },
  [ProductType.OnlineCourse]: {
    label: "Online Courses",
    value: ProductType.OnlineCourse.toString(),
    displayName: "Online Courses",
    description: "Interactive online learning experiences",
    sortOrder: 2,
  },
  [ProductType.GroupSession]: {
    label: "Group Classes",
    value: ProductType.GroupSession.toString(),
    displayName: "Group Sessions",
    description: "Learn together in small groups",
    sortOrder: 3,
  },
  [ProductType.PrivateSession]: {
    label: "1-on-1",
    value: ProductType.PrivateSession.toString(),
    displayName: "Private Sessions",
    description: "One-on-one personalized instruction",
    sortOrder: 4,
  },
};

export const PRODUCT_LEVEL_CONFIG = {
  [ProductLevel.Beginner]: {
    value: ProductLevel.Beginner.toString(),
    label: "Beginner",
    description: "No prior experience required",
  },
  [ProductLevel.Intermediate]: {
    value: ProductLevel.Intermediate.toString(),
    label: "Intermediate",
    description: "Some experience recommended",
  },
  [ProductLevel.Advanced]: {
    value: ProductLevel.Advanced.toString(),
    label: "Advanced",
    description: "Significant experience required",
  },
  [ProductLevel.Expert]: {
    value: ProductLevel.Expert.toString(),
    label: "Expert",
    description: "Professional-level expertise",
  },
} as const;

export const TAB_CONFIG = [
  { id: "best", label: "Bestsellers" },
  { id: "new", label: "New" },
  { id: "popular", label: "Most Popular" },
];

export const PARTICIPANT_OPTIONS = [
  { value: "1-5", label: "1-5 participants" },
  { value: "6-10", label: "6-10 participants" },
  { value: "11-20", label: "11-20 participants" },
  { value: "21-50", label: "21-50 participants" },
  { value: "50+", label: "50+ participants" },
];

export const FILE_REQUIREMENTS = {
  video: {
    format: "MP4 (H.264 codec)",
    resolution: "Minimum 720p (1280x720), recommended 1080p (1920x1080)",
    duration: "Up to 2 hours (varies by platform)",
    fileSize: "Up to 4-10 GB",
    frameRate: "24-30 FPS",
    audio: "AAC, 128-192 kbps",
  },
  image: {
    format: "JPEG, PNG",
    fileSize: "Up to 5 MB",
    colorSpace: "sRGB",
  },
  document: {
    formats: "PDF, DOCX, PPTX",
    maxFileSize: "50 MB",
    structure: "Clear and easy to read",
  },
};

export const MODERATION_INFO = {
  description:
    "Before your files is published, it must pass moderation. Below the loading boxes, you'll find a status indicator:",
  statuses: {
    green: "Your video has been approved and will be published.",
    yellow: "Please retry the submission.",
  },
  supportNote:
    "If your fails moderation multiple times in a row, please contact our support team",
};

export const RATING_OPTIONS = [
  { value: 5, label: "5 Stars", description: "Excellent" },
  { value: 4, label: "4+ Stars", description: "Very Good" },
  { value: 3, label: "3+ Stars", description: "Good" },
  { value: 2, label: "2+ Stars", description: "Fair" },
  { value: 1, label: "1+ Stars", description: "Any Rating" },
];

export const PRICE_RANGE_CONFIG = {
  min: 0,
  max: 500,
  step: 5,
  defaultMin: 0,
  defaultMax: 500,
};

export enum EditProductFormSection {
  Details = "details",
  Curriculum = "curriculum",
  Overview = "overview",
}

export const EDIT_PRODUCT_SECTION_LABELS = {
  [EditProductFormSection.Details]: "Details",
  [EditProductFormSection.Curriculum]: "Curriculum",
  [EditProductFormSection.Overview]: "Overview",
};

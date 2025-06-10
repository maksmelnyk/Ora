import React, { useState } from "react";
import { FileText, Star, Video } from "lucide-react";
import { cn, formatDuration } from "@/common/utils";
import { Collapsible, CollapsibleItem } from "@/common/components";
import {
  ProductDetailsResponse,
  ModuleResponse,
  LessonResponse,
} from "../../types";

interface LessonItemProps {
  lesson: LessonResponse;
  lessonIndex: number;
  isStarred?: boolean;
  onStarToggle?: () => void;
  onPlay?: () => void;
  isLast?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  lessonIndex,
  isStarred = false,
  onStarToggle,
  onPlay,
  isLast = false,
}) => {
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStarToggle?.();
  };

  const rightContent = (
    <>
      <span className="ora-body text-sm text-ora-gray">
        {formatDuration(lesson.durationMin)}
      </span>
      <FileText className="w-4 h-4 text-ora-gray" />
      <button
        onClick={handleStarClick}
        className="p-1 hover:bg-ora-gray-100 rounded ora-transition"
        aria-label={isStarred ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className={cn(
            "w-4 h-4",
            isStarred ? "text-yellow-400 fill-current" : "text-ora-gray"
          )}
        />
      </button>
    </>
  );

  return (
    <CollapsibleItem
      leftIcon={<Video className="w-5 h-5 text-ora-gray" />}
      title={`Lesson ${lessonIndex + 1}: ${lesson.title}`}
      rightContent={rightContent}
      onClick={onPlay}
      isLast={isLast}
    />
  );
};

// interface ResourceItemProps {
//   title: string;
//   type: "download" | "article";
//   isLast?: boolean;
// }

// const ResourceItem: React.FC<ResourceItemProps> = ({
//   title,
//   type,
//   isLast = false,
// }) => {
//   const Icon = type === "download" ? Download : FileText;

//   const rightContent = (
//     <>
//       <FileText className="w-4 h-4 text-ora-gray" />
//       <button
//         className="p-1 hover:bg-ora-gray-100 rounded ora-transition"
//         aria-label="Add to favorites"
//       >
//         <Star className="w-4 h-4 text-ora-gray" />
//       </button>
//     </>
//   );

//   return (
//     <CollapsibleItem
//       leftIcon={<Icon className="w-5 h-5 text-ora-gray" />}
//       title={`${type === "download" ? "Resources" : "Article"}: ${title}`}
//       rightContent={rightContent}
//       isLast={isLast}
//     />
//   );
// };

interface ModuleSectionProps {
  module: ModuleResponse;
  moduleIndex: number;
  defaultOpen?: boolean;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({
  module,
  moduleIndex,
  defaultOpen = false,
}) => {
  const [starredLessons, setStarredLessons] = useState<Set<string>>(new Set());

  const handleLessonStarToggle = (lessonId: string) => {
    const newStarred = new Set(starredLessons);
    if (newStarred.has(lessonId)) {
      newStarred.delete(lessonId);
    } else {
      newStarred.add(lessonId);
    }
    setStarredLessons(newStarred);
  };

  const handleLessonPlay = (lessonId: string) => {
    console.log(`Playing lesson: ${lessonId}`);
  };

  const lessons = module.lessons || [];
  const hasResources = moduleIndex === 0;

  const moduleContent = (
    <>
      {lessons.map((lesson, lessonIndex) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          lessonIndex={lessonIndex}
          isStarred={starredLessons.has(lesson.id)}
          onStarToggle={() => handleLessonStarToggle(lesson.id)}
          onPlay={() => handleLessonPlay(lesson.id)}
          isLast={!hasResources && lessonIndex === lessons.length - 1}
        />
      ))}
    </>
  );

  return (
    <Collapsible
      title={`Module ${moduleIndex + 1}: ${module.title}`}
      description={module.description}
      defaultOpen={defaultOpen}
      showMoreButton={true}
    >
      {moduleContent}
    </Collapsible>
  );
};

interface ProductContentTabProps {
  product: ProductDetailsResponse;
  className?: string;
}

const ProductContentTab: React.FC<ProductContentTabProps> = ({
  product,
  className,
}) => {
  if (!product.modules || product.modules.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <p className="ora-body text-ora-gray">
            No content available for this product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-ora-bg", className)}>
      <div className="space-y-0">
        {product.modules
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((module, index) => (
            <ModuleSection
              key={module.id}
              module={{
                ...module,
                lessons:
                  module.lessons?.sort((a, b) => a.sortOrder - b.sortOrder) ||
                  [],
              }}
              moduleIndex={index}
              defaultOpen={index === 0}
            />
          ))}
      </div>
    </div>
  );
};

export default ProductContentTab;

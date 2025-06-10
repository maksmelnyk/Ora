import React from "react";
import EducatorCard from "@/features/educators/components/EducatorCard";
import { EducatorSummaryResponse } from "@/features/educators/types";

interface RecommendedEducatorsProps {
  educators: EducatorSummaryResponse[];
  isLoading?: boolean;
  error?: Error | null;
}

export const RecommendedEducators: React.FC<RecommendedEducatorsProps> = ({
  educators,
  isLoading = false,
  error = null,
}) => {
  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <section>
        <div className="mb-6">
          <h2 className="ora-heading text-2xl text-ora-navy">
            Recommended Educators
          </h2>
          <p className="mt-2 ora-body text-ora-gray">
            Learn from expert educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="bg-ora-gray-100 rounded-xl h-32 animate-pulse" />
              <div className="space-y-2">
                <div className="bg-ora-gray-100 rounded h-4 animate-pulse" />
                <div className="bg-ora-gray-100 rounded h-3 animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!educators || educators.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="ora-heading text-2xl text-ora-navy">
          Recommended Instructors
        </h2>
        <p className="mt-2 ora-body text-ora-gray">
          Learn from expert instructors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
        {educators.slice(0, 4).map((educator) => (
          <EducatorCard key={educator.id} educator={educator} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedEducators;

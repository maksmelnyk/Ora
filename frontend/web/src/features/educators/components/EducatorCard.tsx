import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { routes } from "@/common/constants/routes";
import { Avatar, Card } from "@/common/components";
import { cn, formatCounter } from "@/common/utils";
import { EducatorSummaryResponse } from "../types";

interface EducatorCardProps {
  key: string;
  educator: EducatorSummaryResponse;
  className?: string;
}

const EducatorCard: React.FC<EducatorCardProps> = ({ educator, className }) => {
  const fullName = `${educator.firstName} ${educator.lastName}`;

  return (
    <Link to={routes.profiles.profile.to(educator.id)}>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden pr-2 pl-2 pt-5 pb-8 relative",
          "bg-ora-teal/20 border-l-8 border-ora-teal rounded-l-none",
          className
        )}
        hoverable
      >
        <div className="flex items-star">
          <div className="flex-shrink-0">
            <Avatar
              src={educator.imageUrl}
              name={fullName}
              size="xl"
              className="w-36 h-36"
            />
          </div>

          <div className="flex-1 min-w-0 px-4">
            <h3 className="ora-subheading text-xl text-ora-navy group-hover:text-ora-highlight ora-transition mb-2">
              {fullName}
            </h3>

            <p className="ora-body text-xs text-ora-gray line-clamp-3 mb-4">
              {educator.bio ||
                "List of teacher qualifications and a brief description of experience in a field"}
            </p>

            <div className="flex items-center justify-start">
              <div className="flex-1 text-center pr-1">
                <div className="flex justify-center items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-current text-ora-navy" />
                  <span className="ora-heading text-base text-ora-navy">
                    {educator.rating}
                  </span>
                </div>
                <div className="ora-body text-xs text-ora-gray">rating</div>
              </div>

              <div className="h-6 w-px bg-gray-400" />

              <div className="flex-1 text-center px-1">
                <div className="ora-heading text-base text-ora-navy mb-1">
                  {formatCounter(educator.studentCount)}
                </div>
                <div className="ora-body text-xs text-ora-gray">students</div>
              </div>

              <div className="h-6 w-px bg-gray-400" />

              <div className="flex-1 text-center pl-1">
                <div className="ora-heading text-base text-ora-navy mb-1">
                  {formatCounter(educator.productCount)}
                </div>
                <div className="ora-body text-xs text-ora-gray">courses</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EducatorCard;

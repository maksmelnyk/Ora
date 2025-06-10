import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Calendar,
  ChartNoAxesColumnIncreasing,
  Globe,
  Star,
} from "lucide-react";
import { routes } from "@/common/constants/routes";
import {
  cn,
  formatCounter,
  formatCurrency,
  formatDate,
  getLanguageNameFromIsoCode,
} from "@/common/utils";
import { Card, CardContent, CardImage } from "@/common/components";
import { ProductSummaryResponse } from "../../types";
import { getProductLevelLabel } from "../../utils";

interface ProductSummaryCardProps {
  key: string;
  product: ProductSummaryResponse;
  onBookmark?: (id: string) => void;
  className?: string;
}

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  product,
  onBookmark,
  className,
}) => {
  const name = product.educator?.firstName + " " + product.educator?.lastName;
  const navigate = useNavigate();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(product.id);
  };

  const handleOwnerRedirectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(routes.profiles.profile.to(product.educator.id));
  };

  return (
    <Link to={routes.products.details.to(product.id)}>
      <Card className={cn("group cursor-pointer", className)} hoverable>
        <div className="relative">
          <CardImage
            //src={product.imageUrl}
            alt={product.title}
            aspectRatio="video"
          />
          {onBookmark && (
            <button
              onClick={handleBookmarkClick}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full ora-transition",
                "bg-white/80 backdrop-blur-sm hover:bg-white",
                "shadow-sm hover:shadow-md",
                product.isBookmarked ? "text-ora-highlight" : "text-ora-gray"
              )}
              aria-label={
                product.isBookmarked ? "Remove bookmark" : "Add bookmark"
              }
            >
              <Bookmark
                className="w-4 h-4"
                fill={product.isBookmarked ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>

        <CardContent className="space-y-3 px-0 pb-0">
          <div>
            <h3 className="ora-heading text-base font-semibold line-clamp-1 group-hover:text-ora-highlight ora-transition">
              {product.title}
            </h3>
            <p className="ora-body text-sm mt-1 line-clamp-1 text-ora-gray">
              {product.description}
            </p>
            {product.educator && (
              <p className="ora-body text-sm mt-1">
                A course by
                <button
                  onClick={handleOwnerRedirectClick}
                  className="text-ora-highlight hover:underline cursor-pointer font-medium pl-1"
                >
                  {name}
                </button>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray mt-1">
              <ChartNoAxesColumnIncreasing className="w-4 h-4" />
              Level:{" "}
              <span className="ml-1 text-ora-teal">
                {getProductLevelLabel(product.level)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
              <Globe className="w-4 h-4" />
              <span>
                Language: {getLanguageNameFromIsoCode(product.language)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
              <Calendar className="w-4 h-4" />
              <span>
                Access:{" "}
                {product.startDate && product.endDate
                  ? `${formatDate(product.startDate)} - ${formatDate(
                      product.endDate
                    )}`
                  : product.startDate
                  ? formatDate(product.startDate)
                  : product.endDate
                  ? formatDate(product.endDate)
                  : "Unlimited"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="font-extrabold text-xl text-ora-teal whitespace-nowrap">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="ora-emphasis text-sm">{product.rating}</span>
              <span className="ora-body text-sm">
                ({formatCounter(product.ratingCount)})
              </span>
            </div>
          </div>

          {/* <Button
            variant="teal"
            size="lg"
            fullWidth
            onClick={() => {
              navigate(routes.products.details.to(product.id));
            }}
          >
            Details
          </Button> */}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductSummaryCard;

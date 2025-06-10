import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/common/constants/routes";
import {
  Star,
  Users,
  Clock,
  Globe,
  FileText,
  Calendar,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import {
  cn,
  formatCurrency,
  formatDuration,
  formatCounter,
  formatDate,
  getLanguageNameFromIsoCode,
} from "@/common/utils";
import { Button, Card, CardImage } from "@/common/components";
import { ProductDetailsResponse, ProductType } from "../../types";
import { getProductLevelLabel } from "../../utils";
import { useUser } from "@/common/contexts";

interface ProductDetailsHeaderProps {
  product: ProductDetailsResponse;
  className?: string;
}

const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({
  product,
  className,
}) => {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();

  const educatorName = `${product.educator.firstName} ${product.educator.lastName}`;
  const canPurchase =
    product.educator && currentUser?.id != product.educator.id;
  const showLessons =
    product.type === ProductType.OnlineCourse ||
    product.type === ProductType.PreRecordedCourse;

  const totalLessons =
    product.modules?.reduce(
      (total, module) => total + (module.lessons?.length || 0),
      0
    ) || 0;

  const handlePurchaseClick = () => {
    if (currentUser) navigate(routes.products.checkout.to(product.id));
    else navigate(routes.auth.signUp);
  };

  const handleAddToCartClick = () => {
    if (currentUser) console.log("Add to cart clicked");
    else navigate(routes.auth.signUp);
  };

  return (
    <div
      className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20", className)}
    >
      <div className="flex">
        <Card className="overflow-hidden flex-1 flex flex-col">
          <CardImage
            src={product.imageUrl}
            alt={product.title}
            aspectRatio="video"
            className="w-full h-full flex-1"
          />
        </Card>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <h1 className="ora-heading text-2xl lg:text-2xl text-ora-navy mb-2">
            {product.title}
          </h1>
          <p className="ora-body text-sm text-ora-gray">
            A course by{" "}
            <Link
              to={routes.profiles.profile.to(product.educator.id)}
              className="text-ora-highlight font-medium cursor-pointer hover:underline"
            >
              {educatorName}
            </Link>
          </p>
        </div>

        <div className="items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-current text-yellow-400" />
            <span className="ora-heading text-lg">{product.rating}</span>
            <span className="ora-body text-ora-gray">
              ({formatCounter(product.ratingCount)})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
            <ChartNoAxesColumnIncreasing className="w-4 h-4" />
            Level:{" "}
            <span className="ml-1 text-ora-teal">
              {getProductLevelLabel(product.level)}
            </span>
          </div>

          {showLessons && (
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
              <FileText className="w-4 h-4" />
              <span>Lessons: {totalLessons}</span>
            </div>
          )}

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

          <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
            <Globe className="w-4 h-4" />
            <span>
              Language: {getLanguageNameFromIsoCode(product.language)}
            </span>
          </div>

          {product.maxParticipants && (
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
              <Users className="w-4 h-4" />
              <span>Max Participants: {product.maxParticipants}</span>
            </div>
          )}

          {product.durationMin && (
            <div className="flex items-center space-x-2 text-sm ora-body text-ora-gray">
              <Clock className="w-4 h-4" />
              <span>Duration: {formatDuration(product.durationMin)}</span>
            </div>
          )}
        </div>

        {canPurchase && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handlePurchaseClick}
            >
              Buy {formatCurrency(product.price)}
            </Button>

            <Button
              variant="teal"
              size="md"
              className="flex-1"
              onClick={handleAddToCartClick}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsHeader;

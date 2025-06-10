import React from "react";
import { Link } from "react-router-dom";
import { cn, formatCurrency } from "@/common/utils";
import { routes } from "@/common/constants/routes";
import { ProductPreviewResponse } from "../types";
import { Button, CardImage } from "@/common/components";
import { getProductTypeLabel } from "../utils";

interface ProductPreviewCardProps {
  product: ProductPreviewResponse;
  onRemove?: (productId: string) => void;
  className?: string;
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  product,
  onRemove,
  className,
}) => {
  const handleRemove = () => {
    onRemove?.(product.id);
  };

  const educatorName = product.educator
    ? `${product.educator.firstName} ${product.educator.lastName}`
    : null;

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="w-48 flex-shrink-0">
        <CardImage
          //src={product.imageUrl}
          alt={product.title}
          aspectRatio="video"
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <h3 className="ora-heading text-base mb-1 line-clamp-2">
          <Link
            to={routes.products.details.to(product.id)}
            className="text-ora-navy hover:text-ora-highlight ora-transition"
          >
            {product.title}
          </Link>
        </h3>

        {educatorName && (
          <p className="ora-body text-sm text-ora-gray mb-1">
            A course by{" "}
            <span className="text-ora-highlight hover:underline cursor-pointer">
              {educatorName}
            </span>
          </p>
        )}

        <p className="ora-body text-sm text-ora-gray mb-3">
          Type: {getProductTypeLabel(product.type)}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {onRemove ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-ora-purple hover:text-blue-700 p-0 h-auto font-normal"
              >
                Remove
              </Button>
            ) : (
              <div className="w-16"></div>
            )}
          </div>

          {product.price && (
            <span className="ora-subheading text-lg text-ora-navy whitespace-nowrap">
              Buy {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;

import React from "react";
import { cn } from "@/common/utils";
import { Card, CardContent } from "@/common/components";
import { ProductDetailsResponse } from "../../types";

interface ProductDescriptionTabProps {
  product: ProductDetailsResponse;
  className?: string;
}

const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({
  product,
  className,
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-ora-purple/20 border-l-10 border-ora-purple rounded-l-none">
          <CardContent className="p-6">
            <h3 className="ora-heading text-lg text-ora-navy mb-4">
              What you'll learn?
            </h3>
            <div className="ora-body text-sm text-ora-gray leading-relaxed space-y-1">
              {product.objectives &&
                product.objectives
                  .split(".")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-ora-orange/20 border-l-10 border-ora-orange rounded-l-none">
          <CardContent className="p-6">
            <h3 className="ora-heading text-lg text-ora-navy mb-4">
              Course Highlights
            </h3>
            <div className="ora-body text-sm text-ora-gray leading-relaxed space-y-1">
              {product.highlights &&
                product.highlights
                  .split(".")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="ora-heading text-lg text-ora-navy mb-4">Description</h3>
        <div className="ora-body text-sm text-ora-gray leading-relaxed space-y-1">
          {product.description}
        </div>
      </section>

      <section>
        <h3 className="ora-heading text-lg text-ora-navy mb-4">
          Who this course is for?
        </h3>
        <div className="ora-body text-sm text-ora-gray leading-relaxed space-y-1">
          {product.audience &&
            product.audience
              .split(".")
              .map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}
        </div>
      </section>

      <section className="border border-ora-gray/50 rounded-2xl p-8">
        <h3 className="ora-heading text-lg text-ora-navy mb-4">Requirements</h3>
        <div className="ora-body text-sm text-ora-gray leading-relaxed space-y-1">
          {product.requirements &&
            product.requirements
              .split(".")
              .map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}
        </div>
      </section>
    </div>
  );
};

export default ProductDescriptionTab;

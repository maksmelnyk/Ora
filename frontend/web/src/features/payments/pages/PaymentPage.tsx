import {
  Button,
  Card,
  ErrorDisplay,
  Layout,
  PageLayout,
  Spinner,
} from "@/common/components";
import { formatCurrency } from "@/common/utils";
import ProductPreviewCard from "@/features/products/components/ProductPreviewCard";
import { useProductById } from "@/features/products/hooks/useProducts";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PaymentService } from "../services/paymentService";
import { PaymentCreateRequest } from "../types";

const PaymentPage: React.FC = () => {
  //TODO: Replace with "Cart" implementation
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
    refetch,
  } = useProductById(productId!);

  const handleRemoveItem = (id: string) => {
    console.log(`Removing item with ID: ${id}`);
  };

  const handlePurchase = () => {
    setIsLoading(true);
    const request: PaymentCreateRequest = {
      productId: product!.id,
      providerId: 1,
      scheduledEventId: null,
    };

    try {
      PaymentService.postPayment(request);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (productLoading) {
    return (
      <Layout>
        <PageLayout>
          <Spinner message="Loading..." size="lg" className="py-12" />
        </PageLayout>
      </Layout>
    );
  }

  if (productError || error || !product) {
    return (
      <Layout>
        <PageLayout>
          <ErrorDisplay
            error={productError || { message: "Product not found" }}
            onRetry={refetch}
            title="Failed to load product"
          />
        </PageLayout>
      </Layout>
    );
  }

  const cartItems = [product];
  const totalPrice = cartItems.reduce((s, i) => s + i.price, 0);
  const itemCount = cartItems.length;

  return (
    <Layout>
      <PageLayout>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-700 mb-6">
                    Your Cart
                  </h2>

                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <ProductPreviewCard
                        key={item.id}
                        product={item}
                        onRemove={handleRemoveItem}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Your cart is empty</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-ora-purple/20 border-t-8 border-ora-purple rounded-none">
                <div className="p-6">
                  <h3 className="ora-heading text-center text-xl mb-12">
                    Order Summary
                  </h3>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center">
                      <span className="ora-emphasis text-sm">
                        Items {itemCount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="ora-emphasis text-base">
                        Total price:
                      </span>
                      <span className="ora-subheading text-base">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="ora-subheading text-base">
                        Actual payment:
                      </span>
                      <span className="ora-subheading text-base font-bold">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 text-sm text-gray-600">
                    By completing your purchase you agree to these{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>
                    .
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={cartItems.length === 0 || isLoading}
                    onClick={handlePurchase}
                  >
                    Buy {formatCurrency(totalPrice)}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};

export default PaymentPage;

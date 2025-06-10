import { EmptyState } from "@/common/components";

interface BillingSettingsProps {
  onAddPaymentMethod?: () => Promise<void>;
}

export const BillingSettings: React.FC<BillingSettingsProps> = (
  {
    //onAddPaymentMethod,
  }
) => {
  // const [isLoading, setIsLoading] = useState(false);

  // const handleAddPaymentMethod = async () => {
  //   if (!onAddPaymentMethod) return;

  //   setIsLoading(true);
  //   try {
  //     await onAddPaymentMethod();
  //   } catch (error) {
  //     console.error("Failed to add payment method:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // if (isLoading) <Spinner message="Loading..." size="lg" />;

  return (
    <section aria-labelledby="billing-settings-title">
      <EmptyState
        title="Coming Soon"
        message="Billing & Payment Details will be available soon."
        size="md"
      />
    </section>
  );
};

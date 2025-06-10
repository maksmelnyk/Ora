export interface PaymentCreateRequest {
  productId: string;
  scheduledEventId?: string | null;
  providerId: number;
}

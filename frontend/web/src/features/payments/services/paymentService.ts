import { paymentApi } from "@/common/api/axiosInstance";
import { PaymentCreateRequest } from "../types";

export const PaymentService = {
  async postPayment(data: PaymentCreateRequest): Promise<void> {
    await paymentApi.post<void>("/api/v1/payments/", data);
  },
};

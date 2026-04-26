export type Order = {
  id: string;
  address: string;
  amount: number;
  createdAt: string;
  deliveryStatus: string;
  isCompleted: boolean;
  listingId: string;
  listingName: string;
  paidAt?: string;
  paymentMethod: string;
  paymentStatus: string;
  sellerId: string;
  specificAddress: string;
  userId: string;
}
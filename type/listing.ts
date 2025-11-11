export type Listing = {
  id: string;
  available?: boolean;
  category: string;
  condition: string;
  createdAt?: string;
  description?: string;
  images?: string[];
  thumbnail: string;
  location: string;
  price: number;
  sellerId?: string;
  title: string;
}
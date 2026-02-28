export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  imageUrl?: string;
  tier?: 'Reserved Edition' | 'Collector’s Edition' | 'Signature Edition';
  luxuryStory?: string;
  packagingDetails?: string[];
  badge?: 'Offer' | 'Bestseller' | 'Limited Edition' | 'New Arrival' | 'Low Stock' | 'None';
  specifications?: {
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
    longevity: number; // 0-100 for meter
    sillage: string; // "Light", "Moderate", "Strong"
    occasions: string[];
    season?: string;
    bestTime?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  city: string;
  rating: number;
  comment: string;
}

export interface CartItem extends Product {
  quantity: number;
  isBundle?: boolean;
  selectedTier?: 'Reserved Edition' | 'Collector’s Edition' | 'Signature Edition';
  customization?: string;
  isGift?: boolean;
  giftName?: string;
  giftMessage?: string;
  giftImage?: string;
  addDairyMilk?: boolean;
  dairyMilkQuantity?: number;
}

export interface Bundle {
  id: string;
  title: string;
  productIds: string[];
  bundlePrice: number;
  originalPrice: number;
  discountText: string;
  type: 'duo' | 'trio' | 'set';
  badge?: string;
  description?: string;
}

export interface Upsell {
  triggerProductId: string;
  suggestedProductId: string;
  text: string;
}

export interface Order {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    address: string;
    paymentMethod: 'Cash on Delivery' | 'JazzCash';
  };
  items: CartItem[];
  total: number;
  discountAmount?: number;
  discountPercentage?: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
}

export interface AdminState {
  key: string;
  loggedIn: boolean;
}

export interface StoreData {
  products: Product[];
  bundles: Bundle[];
  upsells: Upsell[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  admin: AdminState;
}
import { Product, CartItem, Order, Bundle, StoreData } from './types';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEY = 'scentsationz_universal_v4';

const sanitizeForStorage = <T>(obj: T): T => {
  if (!obj) return obj;
  try {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.constructor && value.constructor.name !== 'Object') {
          return undefined; 
        }
      }
      return value;
    }));
  } catch (e) {
    console.warn("Storage sanitization failed", e);
    return (Array.isArray(obj) ? [] : {}) as T;
  }
};

export const getLocalCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data).cart || [];
  } catch {
    return [];
  }
};

export const setLocalCart = (cart: CartItem[]) => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const parsed = current ? JSON.parse(current) : {};
    const cleanCart = sanitizeForStorage(cart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, cart: cleanCart }));
  } catch (e) {
    console.error("Cart Persistence Error:", e);
  }
};

export const getAdminState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data).admin || { loggedIn: false, key: "Khazina123" } : { loggedIn: false, key: "Khazina123" };
  } catch {
    return { loggedIn: false, key: "Khazina123" };
  }
};

export const updateAdminStatus = (loggedIn: boolean) => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const parsed = current ? JSON.parse(current) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      ...parsed, 
      admin: { ...(parsed.admin || { key: "Khazina123" }), loggedIn } 
    }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Admin Status Persistence Error:", e);
  }
};

export const getStoreDataSync = (): StoreData => {
  const cart = getLocalCart();
  const admin = getAdminState();
  return {
    products: [], 
    bundles: MOCK_BUNDLES,
    upsells: [],
    cart,
    orders: [],
    reviews: [],
    admin
  };
};

const mapDocToProduct = (d: any): Product => ({
  ...d.data(),
  id: d.id,
  price: Number(d.data().price) || 2800,
  stock: Number(d.data().stock) || 0
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? mapDocToProduct(docSnap) : null;
  } catch (error) {
    console.error("Get Product Error:", error);
    return null;
  }
};

export const addProduct = async (data: Product) => {
  await setDoc(doc(db, 'products', data.id), sanitizeForStorage(data));
};

export const updateProduct = async (product: Product) => {
  const { id, ...data } = product;
  await updateDoc(doc(db, 'products', id), sanitizeForStorage(data));
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      ...d.data(),
      orderId: d.id,
      date: d.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
    } as Order));
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return [];
  }
};

export const addOrder = async (order: Omit<Order, 'orderId' | 'date'>) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...sanitizeForStorage(order),
    createdAt: serverTimestamp()
  });
  setLocalCart([]);
  window.dispatchEvent(new Event('storage'));
  return docRef.id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  await updateDoc(doc(db, 'orders', orderId), { status });
};

export const deleteOrder = async (orderId: string) => {
  await deleteDoc(doc(db, 'orders', orderId));
};

export const addToCart = (
  product: Product, 
  quantity: number, 
  tier?: 'Reserved Edition' | 'Collector’s Edition' | 'Signature Edition', 
  customization?: string,
  giftOptions?: {
    isGift: boolean;
    giftName?: string;
    giftMessage?: string;
    giftImage?: string;
    addDairyMilk?: boolean;
    dairyMilkQuantity?: number;
  }
) => {
  const cart = getLocalCart();
  
  // Luxury pricing logic
  let finalPrice = product.price;
  if (tier === 'Collector’s Edition') finalPrice += 1000;
  if (tier === 'Signature Edition') finalPrice += 2000;
  if (giftOptions?.addDairyMilk && giftOptions.dairyMilkQuantity) {
    finalPrice += (50 * giftOptions.dairyMilkQuantity);
  }

  const existing = cart.find(i => 
    i.id === product.id && 
    i.selectedTier === tier && 
    i.customization === customization &&
    i.isGift === giftOptions?.isGift &&
    i.giftName === giftOptions?.giftName &&
    i.giftMessage === giftOptions?.giftMessage &&
    i.giftImage === giftOptions?.giftImage &&
    i.addDairyMilk === giftOptions?.addDairyMilk &&
    i.dairyMilkQuantity === giftOptions?.dairyMilkQuantity
  );
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ 
      ...product, 
      price: finalPrice,
      quantity, 
      selectedTier: tier, 
      customization,
      ...giftOptions
    });
  }
  
  setLocalCart(cart);
  window.dispatchEvent(new Event('storage'));
};

export const removeFromCart = (
  productId: string, 
  tier?: string, 
  customization?: string,
  isGift?: boolean,
  giftName?: string,
  giftMessage?: string,
  giftImage?: string,
  addDairyMilk?: boolean,
  dairyMilkQuantity?: number
) => {
  const cart = getLocalCart().filter(i => 
    !(i.id === productId && 
      i.selectedTier === tier && 
      i.customization === customization &&
      i.isGift === isGift &&
      i.giftName === giftName &&
      i.giftMessage === giftMessage &&
      i.giftImage === giftImage &&
      i.addDairyMilk === addDairyMilk &&
      i.dairyMilkQuantity === dairyMilkQuantity
    )
  );
  setLocalCart(cart);
  window.dispatchEvent(new Event('storage'));
};

export const updateCartQuantity = (
  productId: string, 
  quantity: number, 
  tier?: string, 
  customization?: string,
  isGift?: boolean,
  giftName?: string,
  giftMessage?: string,
  giftImage?: string,
  addDairyMilk?: boolean,
  dairyMilkQuantity?: number
) => {
  const cart = getLocalCart();
  const item = cart.find(i => 
    i.id === productId && 
    i.selectedTier === tier && 
    i.customization === customization &&
    i.isGift === isGift &&
    i.giftName === giftName &&
    i.giftMessage === giftMessage &&
    i.giftImage === giftImage &&
    i.addDairyMilk === addDairyMilk &&
    i.dairyMilkQuantity === dairyMilkQuantity
  );
  if (item) {
    item.quantity = Math.max(1, quantity);
    setLocalCart(cart);
    window.dispatchEvent(new Event('storage'));
  }
};

export const MOCK_BUNDLES: Bundle[] = [
  {
    id: 'vault-duo',
    title: 'The Vault Duo',
    productIds: ['starborn', 'cool-current'],
    bundlePrice: 4500,
    originalPrice: 5600,
    discountText: 'Reserved Pairing • Free Concierge Shipping',
    type: 'duo',
    badge: 'Popular',
    description: 'Select the ultimate day/night rotation from our Reserved collections.'
  }
];

import { limit } from 'firebase/firestore';

// ... existing imports ...

export const seedIfEmpty = async () => {
  try {
    const productsCol = collection(db, 'products');
    // Optimize: Check only 1 document to see if collection is empty
    const q = query(productsCol, limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log('Registry already synced. Skipping seed.');
      return;
    }

    // Only seed if empty
    console.log('Syncing luxury registry...');
    const batch = writeBatch(db);
    // ... rest of the function ...
    const mockProducts: Product[] = [
        {
          id: 'starborn',
          name: 'STARBORN',
          price: 2250,
          stock: 50,
          description: 'A bold, charismatic scent crafted for leaders and dreamers. Starborn blends smooth elegance with magnetic depth — the kind of fragrance that turns presence into power and moments into memories.',
          category: 'Bold',
          imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
          luxuryStory: 'Starborn is the scent of destiny. Crafted for those who leave an indelible mark on the world, it weaves the ancient depth of oud with the warm, glowing embrace of amber. A fragrance that doesn\'t just linger—it commands.',
          packagingDetails: ['Weighted Obsidian Glass', 'Gold-Embossed Monogram', 'Magnetic Precision Cap'],
          badge: 'Signature',
          specifications: {
            topNotes: ['Saffron', 'Bergamot', 'Spiced Cardamom'],
            middleNotes: ['Black Rose', 'Aged Oud', 'Leather'],
            baseNotes: ['Amber', 'Vanilla', 'Smoked Patchouli'],
            longevity: 98,
            sillage: 'Strong',
            occasions: ['Gala Evenings', 'Power Meetings', 'Night Out']
          }
        },
        {
          id: 'cool-current',
          name: 'COOL CURRENT',
          price: 2250,
          stock: 50,
          description: 'Fresh, modern, and effortlessly confident. Cool Current delivers a crisp wave of energy that feels clean, uplifting, and sharp — perfect for daily wear that still makes a lasting impression.',
          category: 'Fresh',
          imageUrl: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?auto=format&fit=crop&q=80&w=800',
          luxuryStory: 'Cool Current is a breath of absolute clarity. Like a sudden plunge into arctic waters, it awakens the senses with sharp citrus and marine notes, settling into a clean, sophisticated musk. The ultimate companion for the modern visionary.',
          packagingDetails: ['Matte Teal Finish', 'Silver Engraving', 'Soft-Touch Presentation Box'],
          specifications: {
            topNotes: ['Sea Salt', 'Iced Lemon', 'Grapefruit'],
            middleNotes: ['Mint', 'Neroli', 'Lavender'],
            baseNotes: ['Amberwood', 'White Musk', 'Cedar'],
            longevity: 85,
            sillage: 'Moderate',
            occasions: ['Daily Wear', 'Summer Days', 'Office']
          }
        },
        {
          id: 'forever-dawn',
          name: 'FOREVER DAWN',
          price: 2250,
          stock: 50,
          description: 'Soft, clean, and emotionally timeless. Forever Dawn captures the feeling of fresh beginnings — a gentle yet memorable fragrance that stays close but leaves a beautiful trail.',
          category: 'Floral',
          imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
          luxuryStory: 'Forever Dawn captures the fleeting magic of morning light. Delicate jasmine and tuberose dance over a base of creamy sandalwood, creating a scent that is both intimately soft and enduringly beautiful. A promise of endless possibilities.',
          packagingDetails: ['Frosted Glass', 'Rose Gold Accents', 'Velvet Interior'],
          specifications: {
            topNotes: ['Pear', 'Mandarin', 'Pink Pepper'],
            middleNotes: ['Jasmine', 'Tuberose', 'Orange Blossom'],
            baseNotes: ['Sandalwood', 'Vanilla', 'White Musk'],
            longevity: 90,
            sillage: 'Moderate',
            occasions: ['Weddings', 'Spring Afternoons', 'Romantic Dinners']
          }
        },
        {
          id: 'golden-pulse',
          name: 'GOLDEN PULSE',
          price: 2250,
          stock: 50,
          description: 'Rich, playful, and undeniably attention-grabbing. Golden Pulse is a warm, luxurious scent made for celebrations, compliments, and standing out wherever you go.',
          category: 'Warm',
          imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
          luxuryStory: 'Golden Pulse is the rhythm of a night that never ends. It opens with a burst of sweet, spicy energy before melting into a luxurious, honeyed warmth. It is a fragrance for the bold, the charismatic, and the unforgettable.',
          packagingDetails: ['Amber Tinted Glass', 'Gold Leaf Detailing', 'Premium Box'],
          specifications: {
            topNotes: ['Cinnamon', 'Honey', 'Blood Orange'],
            middleNotes: ['Nutmeg', 'Orchid', 'Clove'],
            baseNotes: ['Tonka Bean', 'Amber', 'Mahogany'],
            longevity: 95,
            sillage: 'Strong',
            occasions: ['Parties', 'Winter Nights', 'Celebrations']
          }
        },
        {
          id: 'tobacco-trail',
          name: 'TOBACCO TRAIL',
          price: 2250,
          stock: 50,
          description: 'Deep, mature, and timeless. Tobacco Trail wraps smoky richness with refined warmth, creating a bold signature scent for those who appreciate classic masculinity with modern edge.',
          category: 'Woody',
          imageUrl: 'https://images.unsplash.com/photo-1615397323758-0e1069c9b451?auto=format&fit=crop&q=80&w=800',
          luxuryStory: 'Tobacco Trail is an homage to classic masculinity and refined taste. The raw, earthy richness of tobacco is perfectly balanced by the smooth sweetness of vanilla and tonka bean. A scent that speaks of old libraries, leather armchairs, and quiet confidence.',
          packagingDetails: ['Smoked Glass', 'Copper Engraving', 'Leather-Bound Box'],
          specifications: {
            topNotes: ['Tobacco Leaf', 'Spicy Notes', 'Bergamot'],
            middleNotes: ['Vanilla', 'Cacao', 'Tonka Bean'],
            baseNotes: ['Dried Fruits', 'Woody Notes', 'Sweet Sap'],
            longevity: 92,
            sillage: 'Strong',
            occasions: ['Evening Events', 'Autumn Days', 'Formal Gatherings']
          }
        }
      ];
      for (const p of mockProducts) {
        const docRef = doc(db, 'products', p.id);
        batch.set(docRef, sanitizeForStorage(p));
      }
      await batch.commit();
      console.log('Seeding Complete.');
  } catch (e) {
    console.error('Seeding error:', e);
  }
};
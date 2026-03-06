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
  writeBatch,
  limit
} from 'firebase/firestore';

const STORAGE_KEY = 'scentsationz_universal_v4';
const SEED_FLAG_KEY = 'scentsationz_seeded_v1';

let productsCache: Product[] | null = null;
let bundlesCache: Bundle[] | null = null;

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
    products: productsCache || [], 
    bundles: bundlesCache || [],
    upsells: [],
    cart,
    orders: [],
    reviews: [],
    admin
  };
};

const mapDocToProduct = (d: any): Product => {
  const data = d.data();
  return {
    ...data,
    id: d.id,
    price: Number(data.price),
    stock: Number(data.stock)
  };
};

const mapDocToBundle = (d: any): Bundle => ({
  ...d.data(),
  id: d.id
});

export const getBundles = async (): Promise<Bundle[]> => {
  if (bundlesCache) return bundlesCache;

  try {
    const cached = localStorage.getItem('scentsationz_bundles_cache');
    if (cached) {
      bundlesCache = JSON.parse(cached);
      getDocs(collection(db, 'bundles')).then(snapshot => {
        const fresh = snapshot.docs.map(mapDocToBundle);
        bundlesCache = fresh;
        localStorage.setItem('scentsationz_bundles_cache', JSON.stringify(fresh));
      });
      return bundlesCache!;
    }
  } catch (e) {}

  try {
    const snapshot = await getDocs(collection(db, 'bundles'));
    const bundles = snapshot.docs.map(mapDocToBundle);
    bundlesCache = bundles;
    localStorage.setItem('scentsationz_bundles_cache', JSON.stringify(bundles));
    return bundles;
  } catch (error) {
    return [];
  }
};

export const getProducts = async (): Promise<Product[]> => {
  if (productsCache) return productsCache;

  try {
    const cached = localStorage.getItem('scentsationz_products_cache');
    if (cached) {
      productsCache = JSON.parse(cached);
      getDocs(collection(db, 'products')).then(snapshot => {
        const fresh = snapshot.docs.map(mapDocToProduct);
        productsCache = fresh;
        localStorage.setItem('scentsationz_products_cache', JSON.stringify(fresh));
      });
      return productsCache!;
    }
  } catch (e) {}

  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const products = snapshot.docs.map(mapDocToProduct);
    productsCache = products;
    localStorage.setItem('scentsationz_products_cache', JSON.stringify(products));
    return products;
  } catch (error) {
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (productsCache) {
    const cached = productsCache.find(p => p.id === id);
    if (cached) return cached;
  }

  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const p = mapDocToProduct(docSnap);
      if (productsCache) {
        const idx = productsCache.findIndex(item => item.id === id);
        if (idx > -1) productsCache[idx] = p;
        else productsCache.push(p);
      }
      return p;
    }
    return null;
  } catch (error) {
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

export const MOCK_BUNDLES: Bundle[] = [];

export const seedIfEmpty = async () => {
  if (localStorage.getItem(SEED_FLAG_KEY)) return;

  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(query(productsCol, limit(1)));
    
    if (!snapshot.empty) {
      localStorage.setItem(SEED_FLAG_KEY, 'true');
      return;
    }

    const batch = writeBatch(db);
    
    const mockProducts: Product[] = [
      {
        id: 'starborn',
        name: 'STARBORN',
        price: 2250,
        stock: 50,
        description: 'A bold, charismatic scent crafted for leaders and dreamers.',
        category: 'Bold',
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        luxuryStory: 'Starborn is the scent of destiny.',
        packagingDetails: ['Weighted Obsidian Glass', 'Gold-Embossed Monogram', 'Magnetic Precision Cap'],
        badge: 'Limited Edition',
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
        description: 'Fresh, modern, and effortlessly confident.',
        category: 'Fresh',
        imageUrl: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?auto=format&fit=crop&q=80&w=800',
        luxuryStory: 'Cool Current is a breath of absolute clarity.',
        packagingDetails: ['Matte Teal Finish', 'Silver Engraving', 'Soft-Touch Presentation Box'],
        specifications: {
          topNotes: ['Sea Salt', 'Iced Lemon', 'Grapefruit'],
          middleNotes: ['Mint', 'Neroli', 'Lavender'],
          baseNotes: ['Amberwood', 'White Musk', 'Cedar'],
          longevity: 85,
          sillage: 'Moderate',
          occasions: ['Daily Wear', 'Summer Days', 'Office']
        }
      }
    ];

    for (const p of mockProducts) {
      batch.set(doc(db, 'products', p.id), sanitizeForStorage(p));
    }

    const mockBundles: Bundle[] = [
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

    for (const b of mockBundles) {
      batch.set(doc(db, 'bundles', b.id), sanitizeForStorage(b));
    }

    await batch.commit();
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } catch (e) {
    console.error('Seeding error:', e);
  }
};

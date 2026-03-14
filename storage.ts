import { Product, CartItem, Order, Bundle, StoreData, Promoter, WithdrawalRequest, Promotion } from './types';
import { db, auth } from './firebase';
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
  limit,
  where,
  increment,
  onSnapshot
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const STORAGE_KEY = 'scentsationz_universal_v4';
const SEED_FLAG_KEY = 'scentsationz_seeded_v3';

let productsCache: Product[] | null = (() => {
  try {
    const cached = localStorage.getItem('scentsationz_products_cache');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
})();

let bundlesCache: Bundle[] | null = (() => {
  try {
    const cached = localStorage.getItem('scentsationz_bundles_cache');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
})();

// Initialize real-time listeners for automatic updates
export const initRealTimeSync = () => {
  onSnapshot(collection(db, 'products'), (snapshot) => {
    const fresh = snapshot.docs.map(mapDocToProduct);
    productsCache = fresh;
    localStorage.setItem('scentsationz_products_cache', JSON.stringify(fresh));
    window.dispatchEvent(new Event('products_updated'));
  }, (error) => {
    console.error("Firestore products sync error:", error);
  });

  onSnapshot(collection(db, 'bundles'), (snapshot) => {
    const fresh = snapshot.docs.map(mapDocToBundle);
    bundlesCache = fresh;
    localStorage.setItem('scentsationz_bundles_cache', JSON.stringify(fresh));
    window.dispatchEvent(new Event('bundles_updated'));
  }, (error) => {
    console.error("Firestore bundles sync error:", error);
  });
};

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
    handleFirestoreError(error, OperationType.LIST, 'products');
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
  const sanitized = sanitizeForStorage(data);
  await setDoc(doc(db, 'products', data.id), sanitized);
  if (productsCache) {
    const idx = productsCache.findIndex(p => p.id === data.id);
    if (idx > -1) productsCache[idx] = sanitized;
    else productsCache.push(sanitized);
    window.dispatchEvent(new Event('products_updated'));
  }
};

export const updateProduct = async (product: Product) => {
  const { id, ...data } = product;
  const sanitized = sanitizeForStorage(data);
  await updateDoc(doc(db, 'products', id), sanitized);
  if (productsCache) {
    const idx = productsCache.findIndex(p => p.id === id);
    if (idx > -1) {
      productsCache[idx] = { ...productsCache[idx], ...sanitized };
      window.dispatchEvent(new Event('products_updated'));
    }
  }
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
  if (productsCache) {
    productsCache = productsCache.filter(p => p.id !== id);
    window.dispatchEvent(new Event('products_updated'));
  }
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
  let commissionAmount = 0;
  let commissionStatus: 'Pending' | 'Paid' | 'Cancelled' | undefined = undefined;
  
  if (order.referralCode) {
    let commissionRate = 0.10; // default 10%
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'referral'));
      if (settingsSnap.exists()) {
        const rate = settingsSnap.data().commissionRate;
        if (typeof rate === 'number') {
          commissionRate = rate / 100;
        }
      }
    } catch (e) {
      console.error("Failed to fetch commission rate", e);
    }
    
    commissionAmount = Math.floor(order.total * commissionRate);
    commissionStatus = 'Pending';
  }

  const orderData = {
    ...sanitizeForStorage(order),
    commissionAmount,
    commissionStatus,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'orders'), orderData);
  
  // Decrement stock for each item
  try {
    const batch = writeBatch(db);
    for (const item of order.items) {
      const productRef = doc(db, 'products', item.id);
      batch.update(productRef, {
        stock: increment(-item.quantity)
      });
    }
    await batch.commit();
  } catch (e) {
    console.error("Failed to update inventory", e);
  }
  
  if (order.referralCode) {
    // Increment totalOrders for the promoter
    try {
      const promotersRef = collection(db, 'promoters');
      const q = query(promotersRef, where('referralCode', '==', order.referralCode));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const promoterDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'promoters', promoterDoc.id), {
          totalOrders: increment(1),
          pendingBalance: increment(commissionAmount)
        });
      }
    } catch (e) {
      console.error("Failed to update promoter totalOrders/pendingBalance", e);
    }
  }

  setLocalCart([]);
  window.dispatchEvent(new Event('storage'));
  return docRef.id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (orderSnap.exists()) {
    const orderData = orderSnap.data() as Order;
    
    // If order is completed and has a pending commission, finalize it
    if (status === 'Completed' && orderData.status !== 'Completed' && orderData.referralCode && orderData.commissionStatus === 'Pending') {
      try {
        const promotersRef = collection(db, 'promoters');
        const q = query(promotersRef, where('referralCode', '==', orderData.referralCode));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const promoterDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'promoters', promoterDoc.id), {
            totalEarned: increment(orderData.commissionAmount || 0),
            currentBalance: increment(orderData.commissionAmount || 0),
            pendingBalance: increment(-(orderData.commissionAmount || 0))
          });
          
          await updateDoc(orderRef, { status, commissionStatus: 'Paid' });
          return;
        }
      } catch (e) {
        console.error("Failed to finalize commission", e);
      }
    } else if (status === 'Cancelled' && orderData.commissionStatus === 'Pending') {
      if (orderData.referralCode) {
        try {
          const promotersRef = collection(db, 'promoters');
          const q = query(promotersRef, where('referralCode', '==', orderData.referralCode));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const promoterDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'promoters', promoterDoc.id), {
              pendingBalance: increment(-(orderData.commissionAmount || 0))
            });
          }
        } catch (e) {
          console.error("Failed to cancel pending commission", e);
        }
      }
      await updateDoc(orderRef, { status, commissionStatus: 'Cancelled' });
      return;
    }
  }

  await updateDoc(orderRef, { status });
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

// --- Promoter Functions ---

export const createPromoter = async (uid: string, email: string, name: string) => {
  const referralCode = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
  const promoter: Promoter = {
    id: uid,
    email,
    name,
    referralCode,
    totalReferrals: 0,
    totalOrders: 0,
    totalEarned: 0,
    currentBalance: 0,
    pendingBalance: 0,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'promoters', uid), sanitizeForStorage(promoter));
  return promoter;
};

export const getPromoter = async (uid: string): Promise<Promoter | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'promoters', uid));
    if (docSnap.exists()) {
      return docSnap.data() as Promoter;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getPromoterByReferralCode = async (code: string): Promise<Promoter | null> => {
  try {
    const q = query(collection(db, 'promoters'), where('referralCode', '==', code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as Promoter;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const incrementReferralClicks = async (code: string) => {
  try {
    const q = query(collection(db, 'promoters'), where('referralCode', '==', code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, 'promoters', docId), {
        totalReferrals: increment(1)
      });
    }
  } catch (e) {
    console.error("Failed to increment referral clicks", e);
  }
};

export const requestWithdrawal = async (promoterId: string, amount: number, method: 'Easypaisa' | 'JazzCash', accountName: string, accountNumber: string) => {
  const promoterRef = doc(db, 'promoters', promoterId);
  const promoterSnap = await getDoc(promoterRef);
  
  if (!promoterSnap.exists()) throw new Error("Promoter not found");
  const promoterData = promoterSnap.data() as Promoter;
  
  if (promoterData.currentBalance < amount) throw new Error("Insufficient balance");
  
  // Deduct balance immediately
  await updateDoc(promoterRef, {
    currentBalance: increment(-amount)
  });

  const request: Omit<WithdrawalRequest, 'id'> = {
    promoterId,
    amount,
    method,
    accountName,
    accountNumber,
    status: 'Pending',
    date: new Date().toISOString()
  };

  await addDoc(collection(db, 'withdrawals'), sanitizeForStorage(request));
};

export const getWithdrawalRequests = async (promoterId?: string): Promise<WithdrawalRequest[]> => {
  try {
    let q = query(collection(db, 'withdrawals'), orderBy('date', 'desc'));
    if (promoterId) {
      q = query(collection(db, 'withdrawals'), where('promoterId', '==', promoterId), orderBy('date', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as WithdrawalRequest));
  } catch (error) {
    return [];
  }
};

export const updateWithdrawalStatus = async (requestId: string, status: 'Approved' | 'Rejected', promoterId: string, amount: number) => {
  await updateDoc(doc(db, 'withdrawals', requestId), { status });
  
  if (status === 'Rejected') {
    // Refund balance
    await updateDoc(doc(db, 'promoters', promoterId), {
      currentBalance: increment(amount)
    });
  }
};

export const getAllPromoters = async (): Promise<Promoter[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'promoters'));
    return snapshot.docs.map(d => d.data() as Promoter);
  } catch (error) {
    return [];
  }
};

export const MOCK_BUNDLES: Bundle[] = [];

// --- Promotions Functions ---

export const getPromotions = async (): Promise<Promotion[]> => {
  try {
    const q = query(collection(db, 'promotions'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
  } catch (e) {
    console.error("Failed to fetch promotions", e);
    return [];
  }
};

export const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
  const docRef = await addDoc(collection(db, 'promotions'), sanitizeForStorage(promotion));
  return { id: docRef.id, ...promotion };
};

export const updatePromotion = async (id: string, promotion: Partial<Promotion>) => {
  await updateDoc(doc(db, 'promotions', id), sanitizeForStorage(promotion));
};

export const deletePromotion = async (id: string) => {
  await deleteDoc(doc(db, 'promotions', id));
};

export const captureEmail = async (email: string, source: string = 'newsletter') => {
  try {
    const data = {
      email,
      source,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'captured_emails'), data);
    
    // Trigger server-side email if possible
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn("Server notification failed, but email was saved to database.");
    }
    
    return true;
  } catch (e) {
    console.error("Failed to capture email", e);
    return false;
  }
};

export const getCapturedEmails = async () => {
  const q = query(collection(db, 'captured_emails'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const seedIfEmpty = async () => {
  if (localStorage.getItem(SEED_FLAG_KEY)) return;

  try {
    const batch = writeBatch(db);
    
    const mockProducts: Product[] = [
      {
        id: 'starborn',
        name: 'STARBORN',
        price: 7295,
        stock: 50,
        description: 'Ek zabardast aur taqatwar khushboo. Har mehfil mein apni alag pehchaan banayein.',
        category: 'Bold',
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        luxuryStory: 'Starborn aapki kamyabi aur taqat ki pehchaan hai.',
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
        id: 'tobacco-trail',
        name: 'TOBACCO TRAIL',
        price: 7450,
        stock: 30,
        description: 'Tobacco aur vanilla ka behtareen premium blend. Sardiyon ki raaton ke liye sab se behtareen.',
        category: 'Woody',
        imageUrl: 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80&w=800',
        luxuryStory: 'Tobacco Trail ek private cigar lounge ke shandar safar ka ehsaas hai.',
        packagingDetails: ['Dark Walnut Finish Box', 'Copper-Engraved Plate', 'Heavy Crystal Vessel'],
        badge: 'Bestseller',
        specifications: {
          topNotes: ['Tobacco Leaf', 'Spicy Notes'],
          middleNotes: ['Tonka Bean', 'Tobacco Blossom', 'Vanilla', 'Cacao'],
          baseNotes: ['Dried Fruits', 'Woody Notes'],
          longevity: 95,
          sillage: 'Strong',
          occasions: ['Winter Nights', 'Formal Events', 'Private Lounges']
        }
      },
      {
        id: 'cool-current',
        name: 'COOL CURRENT',
        price: 7595,
        stock: 50,
        description: 'Rozana lagane ke liye ek taaza aur energetic khushboo. Din bhar fresh aur active rahein.',
        category: 'Fresh',
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
        luxuryStory: 'Cool Current ek thandi aur taaza hawa ka jhonka hai.',
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
        bundlePrice: 6500,
        originalPrice: 7100,
        discountText: 'Reserved Pairing • Free Concierge Shipping',
        type: 'duo',
        badge: 'Popular',
        description: 'Hamari Reserved collection se din aur raat ke liye behtareen combo chunein.'
      }
    ];

    for (const b of mockBundles) {
      batch.set(doc(db, 'bundles', b.id), sanitizeForStorage(b));
    }

    const mockPromotions: Promotion[] = [
      {
        id: 'SCENT101',
        title: 'Free Delivery',
        code: 'SCENT101',
        discountAmount: 300,
        description: '1 Mahinay ke liye Free Delivery.',
        type: 'fixed',
        isActive: true,
        validUntil: '2026-04-12',
        colorClass: 'bg-blue-600'
      },
      {
        id: 'welcome-10',
        title: 'Welcome Offer',
        description: 'Apne pehle order par 10% discount haasil karein.',
        code: 'WELCOME10',
        discountPercentage: 10,
        type: 'percentage',
        validUntil: '2026-12-31',
        isActive: true,
        colorClass: 'bg-slate-900'
      }
    ];

    for (const p of mockPromotions) {
      batch.set(doc(db, 'promotions', p.id), sanitizeForStorage(p));
    }

    await batch.commit();
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } catch (e) {
    console.error('Seeding error:', e);
  }
};


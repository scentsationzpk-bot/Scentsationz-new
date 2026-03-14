import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoreDataSync, removeFromCart, updateCartQuantity } from '../storage';
import { CartItem } from '../types';

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Fetch cart items using sync helper
    setItems(getStoreDataSync().cart);
  }, []);

  const handleUpdateQty = (item: CartItem, qty: number) => {
    updateCartQuantity(item.id, qty, item.selectedTier, item.customization, item.isGift, item.giftName, item.giftMessage, item.giftImage, item.addDairyMilk, item.dairyMilkQuantity);
    setItems(getStoreDataSync().cart);
  };

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.id, item.selectedTier, item.customization, item.isGift, item.giftName, item.giftMessage, item.giftImage, item.addDairyMilk, item.dairyMilkQuantity);
    setItems(getStoreDataSync().cart);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Bundle Logic: Buy 2 get 10% off, Buy 3+ get 15% off
  let discountPercentage = 0;
  if (totalItems >= 3) {
    discountPercentage = 0.15;
  } else if (totalItems === 2) {
    discountPercentage = 0.10;
  }
  
  const discountAmount = subtotal * discountPercentage;
  const finalTotal = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center mx-auto mb-8 sm:mb-12 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 sm:w-12 sm:h-12"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tighter uppercase leading-none">Registry Empty</h2>
        <p className="text-slate-500 mb-10 sm:mb-16 text-lg sm:text-xl font-medium max-w-sm mx-auto uppercase tracking-tight">Explore our collections to begin your olfactory journey.</p>
        <Link to="/shop" className="inline-flex items-center px-10 py-5 sm:px-16 sm:py-8 bg-slate-900 text-white font-black rounded-2xl sm:rounded-3xl hover:bg-black transition-all shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase tracking-widest text-xs sm:text-sm border-4 border-slate-900">
          Explore Collection 🛍️
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 animate-in fade-in slide-in-from-bottom-8 duration-500 bg-white selection:bg-slate-900 selection:text-white">
      <div className="flex flex-col sm:flex-row items-baseline gap-4 sm:gap-8 mb-16 sm:mb-24">
        <h1 className="text-6xl sm:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-none">The Bag</h1>
        <span className="text-3xl sm:text-5xl font-black text-slate-300 uppercase tracking-widest italic">Registry</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 sm:gap-24">
        <div className="lg:col-span-2 space-y-12 sm:space-y-16">
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="group flex flex-col sm:flex-row gap-10 sm:gap-16 p-10 sm:p-16 bg-white border-4 border-slate-900 rounded-[2rem] sm:rounded-[4rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] hover:shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-40 h-40 sm:w-64 sm:h-64 bg-slate-50 rounded-3xl sm:rounded-[3rem] flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 overflow-hidden border-4 border-slate-100 group-hover:border-slate-900 transition-colors">
                <img 
                  src={item.imageUrl ? item.imageUrl.replace('w=800', 'w=400') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=60&w=400'} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-contain p-8 sm:p-16 grayscale group-hover:grayscale-0 transition-all duration-700 scale-90 group-hover:scale-100" 
                />
              </div>
              <div className="flex-grow flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 text-center sm:text-left">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-4xl sm:text-5xl text-slate-900 mb-3 uppercase tracking-tighter leading-none">{item.name}</h3>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <span className="bg-slate-100 text-slate-500 font-black text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2 rounded-full border-2 border-slate-200">
                        {item.selectedTier || 'Reserved Edition'}
                      </span>
                      {item.isGift && (
                        <span className="bg-blue-50 text-blue-600 font-black text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2 rounded-full border-2 border-blue-200">
                          Gift Wrap
                        </span>
                      )}
                    </div>
                  </div>

                  {item.customization && (
                    <div className="inline-block px-6 py-3 bg-slate-900 text-white rounded-2xl border-2 border-slate-900">
                      <p className="font-black text-xs sm:text-sm uppercase tracking-widest italic leading-none">"{item.customization}"</p>
                    </div>
                  )}

                  {item.isGift && (
                    <div className="p-6 sm:p-8 bg-blue-50 rounded-3xl border-2 border-blue-200 text-left space-y-3">
                      <p className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Recipient Details</p>
                      {item.giftName && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-blue-400 uppercase text-[10px] tracking-widest mr-3">To:</span> {item.giftName}</p>}
                      {item.giftMessage && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-blue-400 uppercase text-[10px] tracking-widest mr-3">Msg:</span> {item.giftMessage}</p>}
                      {item.addDairyMilk && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-blue-400 uppercase text-[10px] tracking-widest mr-3">Add:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                    </div>
                  )}

                  <div className="flex items-center justify-center sm:justify-start gap-8">
                    <p className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tighter">Rs. {item.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-[10px] sm:text-xs font-black text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 group/btn uppercase tracking-widest"
                    >
                      Discard
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 h-fit self-center bg-slate-50 p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                  <button
                    onClick={() => handleUpdateQty(item, item.quantity - 1)}
                    className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-900 hover:text-white transition-all active:scale-90 border-4 border-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8"><path d="M5 12h14"/></svg>
                  </button>
                  <span className="w-12 sm:w-16 text-center font-black text-2xl sm:text-4xl text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item, item.quantity + 1)}
                    className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-900 hover:text-white transition-all active:scale-90 border-4 border-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border-4 border-slate-900 h-fit shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] lg:sticky lg:top-32">
          <h3 className="text-4xl sm:text-5xl font-black text-slate-900 mb-12 sm:mb-16 tracking-tighter uppercase leading-none">Summary</h3>
          
          {/* Bundle Upsell / Progress */}
          <div className="mb-12 sm:mb-16 p-8 sm:p-10 bg-blue-50 border-4 border-blue-600 rounded-3xl sm:rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
            {totalItems === 1 ? (
              <p className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-widest text-center leading-relaxed">Add 1 more item to unlock <span className="text-blue-600">10% Bundle Discount!</span> 🎁</p>
            ) : totalItems === 2 ? (
              <p className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-widest text-center leading-relaxed"><span className="text-green-600">10% Discount Unlocked!</span> Add 1 more for 15% off! 🚀</p>
            ) : (
              <p className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-widest text-center leading-relaxed"><span className="text-green-600">Maximum 15% Discount Unlocked!</span> 🎉</p>
            )}
          </div>

          <div className="space-y-8 sm:space-y-10 mb-12 sm:mb-20">
            <div className="flex justify-between text-slate-400 font-black uppercase text-xs sm:text-sm tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-blue-600 font-black uppercase text-xs sm:text-sm tracking-widest">
                <span>Bundle Discount ({(discountPercentage * 100).toFixed(0)}%)</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 font-black uppercase text-xs sm:text-sm tracking-widest">
              <span>Shipping</span>
              <span className="text-green-600">Complimentary</span>
            </div>
            <div className="pt-10 sm:pt-12 border-t-4 border-slate-900 flex justify-between items-end">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Total</span>
              <span className="text-4xl sm:text-6xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full inline-flex items-center justify-center py-8 sm:py-12 bg-slate-900 text-white font-black text-2xl sm:text-4xl rounded-3xl sm:rounded-[3rem] hover:bg-black transition-all shadow-[10px_10px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-2 active:translate-y-2 mb-10 uppercase tracking-widest border-4 border-slate-900 animate-pulse"
          >
            Checkout 🗝️
          </Link>
          <div className="bg-slate-50 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 text-center border-4 border-slate-100">
             <p className="text-xs sm:text-sm text-slate-400 font-black uppercase tracking-widest leading-relaxed">Secure cloud-synced registry. Handcrafted for the discerning. 💫</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
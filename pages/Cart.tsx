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
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Registry Empty 🏛️</h2>
        <p className="text-slate-500 mb-10 text-xl font-medium max-w-sm mx-auto uppercase">Explore our collections to begin your olfactory journey.</p>
        <Link to="/shop" className="inline-flex items-center px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs border-4 border-slate-900">
          Explore Collection 🛍️
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white">
      <div className="flex items-end gap-3 sm:gap-4 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase">The Registry Bag</h1>
        <span className="text-xl sm:text-2xl">🏛️</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="group flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8 bg-white border-4 border-slate-900 rounded-2xl sm:rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,0.1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,0.1)] transition-all duration-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 overflow-hidden border-2 border-slate-100">
                <img 
                  src={item.imageUrl ? item.imageUrl.replace('w=800', 'w=200') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=60&w=200'} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-contain p-3 sm:p-4 grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div className="flex-grow flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 text-center sm:text-left">
                <div>
                  <h3 className="font-black text-xl sm:text-2xl text-slate-900 mb-1 uppercase tracking-tighter">{item.name}</h3>
                  <p className="text-slate-400 font-black text-[8px] sm:text-[10px] uppercase tracking-widest mb-1">{item.selectedTier || 'Reserved Edition'}</p>
                  {item.customization && (
                    <p className="text-blue-600 font-black text-[8px] sm:text-[10px] uppercase tracking-widest mb-2 italic">Personalized: "{item.customization}"</p>
                  )}
                  {item.isGift && (
                    <div className="mt-2 mb-4 p-3 bg-slate-50 rounded-xl border-2 border-slate-100 text-left">
                      <p className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🎁 Gift Options</p>
                      {item.giftName && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">To:</span> {item.giftName}</p>}
                      {item.giftMessage && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">Message:</span> {item.giftMessage}</p>}
                      {item.addDairyMilk && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">Extras:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                    </div>
                  )}
                  <p className="text-slate-900 font-black text-lg sm:text-xl mb-4">Rs. {item.price.toLocaleString()}</p>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-[10px] sm:text-sm font-black text-red-400 hover:text-red-600 transition-colors flex items-center justify-center sm:justify-start gap-2 group/btn uppercase tracking-widest"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover/btn:bg-red-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </div>
                    Discard Item
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 h-fit self-center bg-slate-50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-4 border-slate-900">
                  <button
                    onClick={() => handleUpdateQty(item, item.quantity - 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-90 border-2 border-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                  </button>
                  <span className="w-8 sm:w-10 text-center font-black text-lg sm:text-xl text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item, item.quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-90 border-2 border-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border-4 border-slate-900 h-fit shadow-[10px_10px_0px_0px_rgba(15,23,42,0.1)] sm:shadow-[15px_15px_0px_0px_rgba(15,23,42,0.1)] lg:sticky lg:top-32">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tighter uppercase">Registry Total</h3>
          
          {/* Bundle Upsell / Progress */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl">
            {totalItems === 1 ? (
              <p className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-widest text-center">Add 1 more item to unlock 10% Bundle Discount! 🎁</p>
            ) : totalItems === 2 ? (
              <p className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-widest text-center">10% Discount Unlocked! Add 1 more for 15% off! 🚀</p>
            ) : (
              <p className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-widest text-center">Maximum 15% Bundle Discount Unlocked! 🎉</p>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="flex justify-between text-slate-500 font-bold uppercase text-[10px] sm:text-sm">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-blue-600 font-black uppercase text-[10px] sm:text-sm">
                <span>Bundle Discount ({(discountPercentage * 100).toFixed(0)}%)</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 font-bold uppercase text-[10px] sm:text-sm">
              <span>Shipping</span>
              <span className="text-green-600 font-black">Complimentary</span>
            </div>
            <div className="pt-4 sm:pt-6 border-t-4 border-slate-900 flex justify-between text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase">
              <span>Total</span>
              <span>Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full inline-flex items-center justify-center py-4 sm:py-6 bg-slate-900 text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl hover:bg-black transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 mb-6 uppercase tracking-widest border-4 border-slate-900"
          >
            Finalize Selection 🗝️
          </Link>
          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border-2 border-slate-100">
             <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Secure cloud-synced registry. Handcrafted for the discerning. 💫</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getStoreDataSync, addOrder, getPromotions } from '../storage';
import { useToast } from '../App';
import { Promotion } from '../types';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(getStoreDataSync());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    referralCode: localStorage.getItem('scentsationz_referral_code') || '',
  });
  const [isDiscrete, setIsDiscrete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Cash on Delivery'>('JazzCash');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    setData(getStoreDataSync());
  }, []);

  if (data.cart.length === 0) {
    return <Navigate to="/shop" />;
  }

  const totalItems = data.cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = data.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountPercentage = 0;
  if (totalItems >= 3) {
    discountPercentage = 0.15;
  } else if (totalItems === 2) {
    discountPercentage = 0.10;
  }
  
  const discountAmount = subtotal * discountPercentage;
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  const jazzCashDiscount = paymentMethod === 'JazzCash' ? 200 : 0;
  
  const deliveryCharge = 300;
  let deliveryDiscount = 0;
  let cartDiscount = 0;

  if (appliedPromotion) {
    if (appliedPromotion.type === 'free_delivery') {
      deliveryDiscount = deliveryCharge;
    } else if (appliedPromotion.type === 'fixed') {
      cartDiscount = appliedPromotion.discountAmount || 0;
    } else if (appliedPromotion.type === 'percentage') {
      cartDiscount = subtotal * ((appliedPromotion.discountPercentage || 0) / 100);
    }
  }
  
  const finalTotal = subtotalAfterDiscount - jazzCashDiscount + deliveryCharge - deliveryDiscount - cartDiscount;

  const handleApplyCoupon = async () => {
    const allPromotions = await getPromotions();
    const promo = allPromotions.find(p => p.code.toUpperCase() === couponCode.toUpperCase() && p.isActive);
    
    if (promo) {
      setAppliedPromotion(promo);
      setIsCouponApplied(true);
      showToast(`Coupon Applied! ${promo.title} Activated 🚚`, 'success');
    } else {
      showToast('Invalid Coupon Code ❌', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Coordinates required! ⚠️', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          paymentMethod: paymentMethod,
          isDiscrete: isDiscrete
        },
        items: data.cart,
        total: finalTotal,
        discountAmount: discountAmount + jazzCashDiscount, // Combine discounts for record
        discountPercentage: discountPercentage,
        status: 'Pending' as const,
        referralCode: formData.referralCode || undefined
      };

      const orderId = await addOrder(orderPayload);
      localStorage.removeItem('scentsationz_referral_code');
      showToast('Order Vaulted! 🎉', 'success');
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      showToast('Sync Failed. Retry. ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-20 animate-in fade-in slide-in-from-bottom-8 duration-500 bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 sm:mb-24 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-6xl sm:text-9xl font-black text-slate-900 tracking-tighter leading-none uppercase">Checkout</h1>
          <p className="text-slate-400 mt-6 text-xl sm:text-2xl font-black uppercase tracking-widest italic">Finalize your selection. Cloud verified. 💫</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24">
        {/* Contact & Shipping Form */}
        <div className="bg-white p-10 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] h-fit">
          <form onSubmit={handleSubmit} className="space-y-12 sm:space-y-16">
            <div className="space-y-10 sm:space-y-12">
              <div className="space-y-4 sm:space-y-6">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">Recipient Identity</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[2rem] border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl sm:text-2xl outline-none shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="FULL NAME" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                <div className="space-y-4 sm:space-y-6">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">Contact Protocol</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[2rem] border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl sm:text-2xl outline-none shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="03XX XXXXXXX" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">City Hub</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[2rem] border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl sm:text-2xl outline-none shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="CITY" />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <input 
                      type="checkbox" 
                      checked={isDiscrete}
                      onChange={(e) => setIsDiscrete(e.target.checked)}
                      className="peer appearance-none w-8 h-8 border-4 border-slate-900 rounded-lg checked:bg-blue-600 transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="font-black text-xl uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">Scent-Free Discrete Packaging 📦</span>
                </label>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">Voucher Access</label>
                <div className="flex gap-6 sm:gap-8">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value)} 
                    disabled={isCouponApplied}
                    className="flex-grow px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[2rem] border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl sm:text-2xl outline-none shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" 
                    placeholder="COUPON CODE" 
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied || !couponCode}
                    className="px-10 sm:px-16 bg-slate-900 text-white font-black rounded-3xl sm:rounded-[2rem] border-4 border-slate-900 uppercase tracking-widest text-sm sm:text-base disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    {isCouponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">Delivery Coordinates</label>
                <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[2rem] border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl sm:text-2xl outline-none h-40 sm:h-56 resize-none shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="STREET, HOUSE NO, AREA..."></textarea>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-8 sm:space-y-10 pt-8">
                <label className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400 ml-6">Settlement Method</label>
                <div className="grid grid-cols-2 gap-6 sm:gap-8">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] border-4 transition-all flex flex-col items-center gap-4 sm:gap-6 relative overflow-hidden ${
                      paymentMethod === 'JazzCash' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'JazzCash' && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">
                        - Rs. 200
                      </div>
                    )}
                    <span className="text-5xl sm:text-7xl">📱</span>
                    <p className="font-black text-xl sm:text-2xl uppercase tracking-tighter">JazzCash</p>
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${paymentMethod === 'JazzCash' ? 'text-blue-300' : 'text-slate-400'}`}>Instant Verification</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] border-4 transition-all flex flex-col items-center gap-4 sm:gap-6 ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-5xl sm:text-7xl">🚚</span>
                    <p className="font-black text-xl sm:text-2xl uppercase tracking-tighter">COD</p>
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${paymentMethod === 'Cash on Delivery' ? 'text-blue-300' : 'text-slate-400'}`}>Standard Protocol</p>
                  </button>
                </div>
              </div>

              {/* Payment Instruction Card */}
              <div className="p-10 sm:p-16 rounded-3xl sm:rounded-[4rem] border-4 border-slate-900 bg-blue-50 text-slate-900 flex items-center gap-8 sm:gap-12 animate-in zoom-in duration-500 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
                {paymentMethod === 'JazzCash' ? (
                  <>
                    <span className="text-6xl sm:text-8xl shrink-0">📱</span>
                    <div>
                      <p className="font-black text-3xl sm:text-5xl tracking-tighter leading-none">0300 747524</p>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-4 text-slate-500">Send total to this JazzCash number for priority processing.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-6xl sm:text-8xl shrink-0">🏠</span>
                    <div>
                      <p className="font-black text-3xl sm:text-5xl tracking-tighter leading-none">Pay at Door</p>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-4 text-slate-500">Settle your registry balance upon artifact arrival.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-10 sm:py-16 bg-blue-600 text-white font-black text-4xl sm:text-6xl rounded-3xl sm:rounded-[4rem] border-4 border-slate-900 uppercase tracking-tighter leading-none disabled:opacity-50 cursor-pointer touch-manipulation hover:bg-blue-700 active:bg-blue-800 transition-all shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-2 active:translate-y-2 animate-pulse"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {loading ? 'Processing...' : 'Vault Order 🚀'}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-16 sm:space-y-24">
          <div className="bg-white p-10 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] lg:sticky lg:top-32">
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 mb-16 sm:mb-24 tracking-tighter uppercase leading-none">The Haul</h3>
            <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-24">
              {data.cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex flex-col gap-6 group bg-slate-50 p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border-4 border-slate-100 hover:border-slate-900 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-slate-900 block text-2xl sm:text-3xl leading-none uppercase tracking-tighter">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                      <span className="text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-widest mt-3 block">
                        {item.category} {item.selectedTier && `• ${item.selectedTier}`}
                      </span>
                    </div>
                    <span className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tighter">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  
                  {item.isGift && (
                    <div className="p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 space-y-3">
                      <p className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest mb-2">🎁 Gift Protocol</p>
                      {item.giftName && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-3">To:</span> {item.giftName}</p>}
                      {item.giftMessage && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-3">Msg:</span> {item.giftMessage}</p>}
                      {item.addDairyMilk && <p className="text-sm sm:text-base font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-3">Add:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-8 sm:space-y-10 pt-12 sm:pt-16 border-t-4 border-slate-900">
              <div className="flex justify-between text-slate-400 font-black uppercase text-xs sm:text-sm tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-blue-600 font-black uppercase text-xs sm:text-sm tracking-widest">
                  <span>Promo Discount</span>
                  <span>- Rs. {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              {jazzCashDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-black uppercase text-xs sm:text-sm tracking-widest animate-pulse">
                  <span>JazzCash Discount</span>
                  <span>- Rs. {jazzCashDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 font-black uppercase text-xs sm:text-sm tracking-widest">
                <span>Shipping</span>
                <span className="text-slate-900">Rs. {deliveryCharge.toLocaleString()}</span>
              </div>
              {deliveryDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-black uppercase text-xs sm:text-sm tracking-widest">
                  <span>Free Delivery Applied</span>
                  <span>- Rs. {deliveryDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-12 sm:pt-16 mt-8 border-t-4 border-slate-900 flex justify-between items-end">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Total Balance</span>
                <span className="text-5xl sm:text-7xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-16 sm:mt-24 p-10 sm:p-12 bg-slate-50 rounded-3xl sm:rounded-[2rem] text-center border-4 border-slate-100">
              <p className="text-xs sm:text-sm text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                By placing this order, you agree to our terms of service. All orders are subject to stock availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

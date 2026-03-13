
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
          paymentMethod: paymentMethod
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
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12 gap-6 sm:gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">Checkout</h1>
          <p className="text-slate-500 mt-3 sm:mt-4 text-lg sm:text-xl font-medium">Finalize your selection. Cloud verified. 💫</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 md:gap-24">
        {/* Contact & Shipping Form */}
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[3.5rem] border-[4px] border-slate-50 shadow-sm h-fit">
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Recipient Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="Enter Full Name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="03XX XXXXXXX" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="e.g. Lahore" />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Apply Coupon</label>
                <div className="flex gap-3 sm:gap-4">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value)} 
                    disabled={isCouponApplied}
                    className="flex-grow px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" 
                    placeholder="Enter Coupon Code" 
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied || !couponCode}
                    className="px-6 sm:px-8 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl border-4 border-slate-900 uppercase tracking-widest text-[10px] sm:text-xs disabled:opacity-50"
                  >
                    {isCouponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Delivery Address</label>
                <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none h-32 sm:h-40 resize-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="Street, House No, Area..."></textarea>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Referral Code (Optional)</label>
                <input type="text" value={formData.referralCode} onChange={e => setFormData(prev => ({ ...prev, referralCode: e.target.value }))} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-lg sm:text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="Enter code if you have one" />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 sm:space-y-6 pt-4">
                <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Payment Method</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-4 transition-all flex flex-col items-center gap-1 sm:gap-2 relative overflow-hidden ${
                      paymentMethod === 'JazzCash' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] sm:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'JazzCash' && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-[6px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-widest animate-pulse">
                        Save Rs. 200
                      </div>
                    )}
                    <span className="text-2xl sm:text-4xl">📱</span>
                    <p className="font-black text-sm sm:text-lg uppercase tracking-tight">JazzCash</p>
                    <p className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-widest ${paymentMethod === 'JazzCash' ? 'text-blue-300' : 'text-slate-400'}`}>Get Rs. 200 OFF</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-4 transition-all flex flex-col items-center gap-1 sm:gap-2 ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] sm:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl sm:text-4xl">🚚</span>
                    <p className="font-black text-sm sm:text-lg uppercase tracking-tight">COD</p>
                    <p className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-widest ${paymentMethod === 'Cash on Delivery' ? 'text-blue-300' : 'text-slate-400'}`}>No Extra Charges</p>
                  </button>
                </div>
              </div>

              {/* Payment Instruction Card */}
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl border-4 border-slate-900 bg-blue-50 text-slate-900 flex items-center gap-4 sm:gap-6 animate-in zoom-in duration-300 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                {paymentMethod === 'JazzCash' ? (
                  <>
                    <span className="text-3xl sm:text-5xl shrink-0">📱</span>
                    <div>
                      <p className="font-black text-xl sm:text-2xl tracking-tighter leading-none">0300 747524</p>
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-1.5 sm:mt-2 text-slate-500">Send total to this JazzCash number.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl sm:text-5xl shrink-0">🏠</span>
                    <div>
                      <p className="font-black text-xl sm:text-2xl tracking-tighter leading-none">Pay at Door</p>
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-1.5 sm:mt-2 text-slate-500">Pay cash upon delivery.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full h-20 sm:h-24 bg-blue-600 text-white font-black text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-4 border-slate-900 uppercase tracking-tighter leading-none disabled:opacity-50 cursor-pointer touch-manipulation hover:bg-blue-700 active:bg-blue-800 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {loading ? 'Processing...' : 'Place Order 🚀'}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-8 sm:space-y-12">
          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] sm:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] lg:sticky lg:top-32">
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 sm:mb-10 tracking-tighter uppercase">Your Haul</h3>
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              {data.cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex flex-col gap-2 group bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-black text-slate-800 block text-base sm:text-lg leading-none">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                      <span className="text-slate-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-1 block">
                        {item.category} {item.selectedTier && `• ${item.selectedTier}`}
                      </span>
                    </div>
                    <span className="text-slate-900 font-black text-base sm:text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  
                  {item.isGift && (
                    <div className="mt-2 p-3 bg-white rounded-xl border-2 border-slate-100">
                      <p className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🎁 Gift Options</p>
                      {item.giftName && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">To:</span> {item.giftName}</p>}
                      {item.giftMessage && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">Message:</span> {item.giftMessage}</p>}
                      {item.addDairyMilk && <p className="text-[10px] sm:text-xs font-bold text-slate-700"><span className="text-slate-400">Extras:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t-4 border-slate-900">
              <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] sm:text-xs tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-blue-600 font-black uppercase text-[10px] sm:text-xs tracking-widest">
                  <span>Promo Discount</span>
                  <span>- Rs. {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              {jazzCashDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-black uppercase text-[10px] sm:text-xs tracking-widest animate-pulse">
                  <span>JazzCash Discount</span>
                  <span>- Rs. {jazzCashDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] sm:text-xs tracking-widest">
                <span>Shipping</span>
                <span>Rs. {deliveryCharge.toLocaleString()}</span>
              </div>
              {deliveryDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-black uppercase text-[10px] sm:text-xs tracking-widest">
                  <span>Free Delivery Applied</span>
                  <span>- Rs. {deliveryDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 sm:pt-6 mt-4 border-t-4 border-slate-900 flex justify-between items-end">
                <span className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tighter">Total Amount</span>
                <span className="text-2xl sm:text-4xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-slate-50 rounded-xl sm:rounded-2xl text-center border-2 border-slate-200">
              <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
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

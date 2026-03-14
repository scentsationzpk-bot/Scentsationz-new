
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getStoreDataSync, addOrder, getPromotions } from '../storage';
import { useToast } from '../App';
import { Promotion } from '../types';
import { User, Phone, MapPin, Home, Tag, Package, CreditCard, Truck, Users } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState<'SadaPay' | 'Cash on Delivery'>('SadaPay');
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
  
  const sadaPayDiscount = 0;
  
  const deliveryCharge = 0; // Free shipping
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
  
  const finalTotal = subtotalAfterDiscount - sadaPayDiscount + deliveryCharge - deliveryDiscount - cartDiscount;

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
        discountAmount: discountAmount + sadaPayDiscount, // Combine discounts for record
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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-8 duration-500 bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">Checkout</h1>
        <p className="text-slate-400 mt-4 text-base sm:text-xl font-black uppercase tracking-widest italic">Finalize your selection. Scroll to secure order ↓</p>
        <div className="mt-6 inline-block px-6 py-2 border-4 border-slate-900 rounded-full bg-green-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <span className="text-green-600 font-black text-xs sm:text-sm uppercase tracking-widest">🚚 Free Nationwide Shipping Applied</span>
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {/* Order Summary Section (Moved to top for mobile) */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 sm:mb-10 tracking-tighter uppercase leading-none">The Haul</h3>
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {data.cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex flex-col gap-3 group bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-4 border-slate-100 hover:border-slate-900 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-black text-slate-900 block text-lg sm:text-xl leading-none uppercase tracking-tighter">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                    <span className="text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-widest mt-1 block">
                      {item.category} {item.selectedTier && `• ${item.selectedTier}`}
                    </span>
                  </div>
                  <span className="text-slate-900 font-black text-lg sm:text-xl tracking-tighter">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
                
                {item.isGift && (
                  <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-2 border-slate-200 space-y-1 mt-2">
                    <p className="text-[10px] sm:text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">🎁 Gift Protocol</p>
                    {item.giftName && <p className="text-xs sm:text-sm font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-2">To:</span> {item.giftName}</p>}
                    {item.giftMessage && <p className="text-xs sm:text-sm font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-2">Msg:</span> {item.giftMessage}</p>}
                    {item.addDairyMilk && <p className="text-xs sm:text-sm font-bold text-slate-900"><span className="text-slate-400 uppercase text-[10px] tracking-widest mr-2">Add:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t-4 border-slate-900">
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
            <div className="flex justify-between text-slate-400 font-black uppercase text-xs sm:text-sm tracking-widest">
              <span>Shipping</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="pt-6 sm:pt-8 mt-4 border-t-4 border-slate-900 flex justify-between items-end">
              <span className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Total Balance</span>
              <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Contact & Shipping Form */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Recipient Identity</label>
                <div className="relative flex items-center">
                    <User className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="FULL NAME" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Contact Protocol</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="03XX XXXXXXX" />
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">City Hub</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="CITY" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Voucher Access</label>
                  <div className="relative flex items-center">
                    <Tag className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                      disabled={isCouponApplied}
                      className="w-full pl-12 pr-20 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" 
                      placeholder="COUPON" 
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      disabled={isCouponApplied || !couponCode}
                      className="absolute right-2 px-4 py-2 sm:py-3 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl border-2 border-slate-900 uppercase tracking-widest text-[10px] sm:text-xs disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {isCouponApplied ? '✓' : 'Apply'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Referral Code (Optional)</label>
                  <div className="relative flex items-center">
                    <Users className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.referralCode} 
                      onChange={e => setFormData(prev => ({ ...prev, referralCode: e.target.value }))} 
                      className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" 
                      placeholder="REFERRAL CODE" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Delivery Coordinates</label>
                <div className="relative flex items-start">
                    <Home className="absolute left-4 top-5 w-5 h-5 text-slate-400" />
                    <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-white focus:bg-slate-50 transition-all font-black text-base sm:text-lg outline-none h-32 sm:h-40 resize-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] placeholder:text-slate-300 uppercase tracking-widest" placeholder="STREET, HOUSE NO, AREA..."></textarea>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Settlement Method</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SadaPay')}
                    className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 sm:gap-4 relative overflow-hidden ${
                      paymentMethod === 'SadaPay' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" />
                    <p className="font-black text-sm sm:text-lg uppercase tracking-tighter">SadaPay</p>
                    <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'SadaPay' ? 'text-blue-300' : 'text-slate-400'}`}>Instant Verification</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 sm:gap-4 ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Truck className="w-8 h-8 sm:w-10 sm:h-10" />
                    <p className="font-black text-sm sm:text-lg uppercase tracking-tighter">COD</p>
                    <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'Cash on Delivery' ? 'text-blue-300' : 'text-slate-400'}`}>Standard Protocol</p>
                  </button>
                </div>
              </div>

              {/* Payment Instruction Card */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 bg-blue-50 text-slate-900 flex items-center gap-4 sm:gap-6 animate-in zoom-in duration-500 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                {paymentMethod === 'SadaPay' ? (
                  <>
                    <span className="text-4xl sm:text-5xl shrink-0">💳</span>
                    <div>
                      <p className="font-black text-xl sm:text-3xl tracking-tighter leading-none">0370 0162012</p>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2 text-slate-500">Send total to this SadaPay number and WhatsApp the screenshot for priority processing.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl shrink-0">🏠</span>
                    <div>
                      <p className="font-black text-xl sm:text-3xl tracking-tighter leading-none">Pay at Door</p>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2 text-slate-500">Settle your registry balance upon artifact arrival.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-6 sm:py-8 bg-blue-600 text-white font-black text-2xl sm:text-4xl rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 uppercase tracking-tighter leading-none disabled:opacity-50 cursor-pointer touch-manipulation hover:bg-blue-700 active:bg-blue-800 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 animate-pulse"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {loading ? 'Processing...' : 'Vault Order 🚀'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 sm:mt-12 p-4 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-[2rem] text-center border-4 border-slate-100">
          <p className="text-[9px] sm:text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
            By placing this order, you agree to our terms of service. All orders are subject to stock availability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

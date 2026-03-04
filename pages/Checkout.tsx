
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getStoreDataSync, addOrder } from '../storage';
import { useToast } from '../App';
import FastButton from '../components/FastButton';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(getStoreDataSync());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Cash on Delivery'>('JazzCash');
  const [loading, setLoading] = useState(false);

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
  const codSurcharge = 0; // No extra COD charges as per request
  
  const finalTotal = subtotalAfterDiscount - jazzCashDiscount + codSurcharge;

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
        status: 'Pending' as const
      };

      const orderId = await addOrder(orderPayload);
      showToast('Order Vaulted! 🎉', 'success');
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      showToast('Sync Failed. Retry. ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">Checkout</h1>
          <p className="text-slate-500 mt-4 text-xl font-medium">Finalize your selection. Cloud verified. 💫</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        {/* Contact & Shipping Form */}
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-[4px] border-slate-50 shadow-sm h-fit">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Recipient Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="Enter Full Name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="03XX XXXXXXX" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="e.g. Lahore" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Delivery Address</label>
                <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl outline-none h-40 resize-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" placeholder="Street, House No, Area..."></textarea>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-6 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 relative overflow-hidden ${
                      paymentMethod === 'JazzCash' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'JazzCash' && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        Save Rs. 200
                      </div>
                    )}
                    <span className="text-4xl">📱</span>
                    <p className="font-black text-lg uppercase tracking-tight">JazzCash</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${paymentMethod === 'JazzCash' ? 'text-blue-300' : 'text-slate-400'}`}>Get Rs. 200 OFF</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-4xl">🚚</span>
                    <p className="font-black text-lg uppercase tracking-tight">COD</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${paymentMethod === 'Cash on Delivery' ? 'text-blue-300' : 'text-slate-400'}`}>No Extra Charges</p>
                  </button>
                </div>
              </div>

              {/* Payment Instruction Card */}
              <div className="p-8 rounded-2xl border-4 border-slate-900 bg-blue-50 text-slate-900 flex items-center gap-6 animate-in zoom-in duration-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                {paymentMethod === 'JazzCash' ? (
                  <>
                    <span className="text-5xl shrink-0">📱</span>
                    <div>
                      <p className="font-black text-2xl tracking-tighter leading-none">0300 747524</p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-500">Send total to this JazzCash number.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-5xl shrink-0">🏠</span>
                    <div>
                      <p className="font-black text-2xl tracking-tighter leading-none">Pay at Door</p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-500">Pay cash upon delivery.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <FastButton 
              disabled={loading} 
              className="w-full py-8 bg-blue-600 text-white font-black text-3xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 active:scale-[0.98] active:bg-blue-700 md:hover:bg-blue-700 uppercase tracking-tighter leading-none disabled:opacity-50 touch-manipulation cursor-pointer select-none transition-transform duration-75"
            >
              {loading ? 'Processing...' : 'Place Order 🚀'}
            </FastButton>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-12">
          <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] sticky top-32">
            <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter uppercase">Your Haul</h3>
            <div className="space-y-6 mb-10">
              {data.cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex flex-col gap-2 group bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-black text-slate-800 block text-lg leading-none">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1 block">
                        {item.category} {item.selectedTier && `• ${item.selectedTier}`}
                      </span>
                    </div>
                    <span className="text-slate-900 font-black text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  
                  {item.isGift && (
                    <div className="mt-2 p-3 bg-white rounded-xl border-2 border-slate-100">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🎁 Gift Options</p>
                      {item.giftName && <p className="text-xs font-bold text-slate-700"><span className="text-slate-400">To:</span> {item.giftName}</p>}
                      {item.giftMessage && <p className="text-xs font-bold text-slate-700"><span className="text-slate-400">Message:</span> {item.giftMessage}</p>}
                      {item.addDairyMilk && <p className="text-xs font-bold text-slate-700"><span className="text-slate-400">Extras:</span> Dairy Milk x{item.dairyMilkQuantity}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t-4 border-slate-900">
              <div className="flex justify-between text-slate-500 font-black uppercase text-xs tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-blue-600 font-black uppercase text-xs tracking-widest">
                  <span>Bundle Discount ({(discountPercentage * 100).toFixed(0)}%)</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              {jazzCashDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-black uppercase text-xs tracking-widest animate-pulse">
                  <span>JazzCash Discount</span>
                  <span>- Rs. {jazzCashDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 font-black uppercase text-xs tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600">FREE 🚚</span>
              </div>
              <div className="pt-6 mt-4 border-t-4 border-slate-900 flex justify-between items-end">
                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total Amount</span>
                <span className="text-4xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-2xl text-center border-2 border-slate-200">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
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

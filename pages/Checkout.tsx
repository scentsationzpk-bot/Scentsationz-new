
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getStoreDataSync, addOrder } from '../storage';
import { useToast } from '../App';

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

  const subtotal = data.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const codSurcharge = paymentMethod === 'Cash on Delivery' ? 300 : 0;
  const finalTotal = subtotal + codSurcharge;

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
                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl outline-none" placeholder="Enter Full Name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl outline-none" placeholder="03XX XXXXXXX" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl outline-none" placeholder="e.g. Lahore" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Delivery Address</label>
                <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl outline-none h-40 resize-none" placeholder="Street, House No, Area..."></textarea>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-6 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'JazzCash' 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl' 
                        : 'border-slate-50 bg-slate-50 text-slate-400 grayscale'
                    }`}
                  >
                    <span className="text-4xl">📱</span>
                    <p className="font-black text-lg uppercase tracking-tight">JazzCash</p>
                    <p className="text-[9px] font-bold opacity-70">Best Value • Free Ship</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl' 
                        : 'border-slate-50 bg-slate-50 text-slate-400 grayscale'
                    }`}
                  >
                    <span className="text-4xl">🚚</span>
                    <p className="font-black text-lg uppercase tracking-tight">COD</p>
                    <p className="text-[9px] font-bold opacity-70">+Rs. 300 Service Fee</p>
                  </button>
                </div>
              </div>

              {/* Payment Instruction Card */}
              <div className="p-8 rounded-[2rem] border-4 border-blue-600 bg-blue-50 text-blue-600 flex items-center gap-6 animate-in zoom-in duration-300">
                {paymentMethod === 'JazzCash' ? (
                  <>
                    <span className="text-5xl shrink-0">📱</span>
                    <div>
                      <p className="font-black text-2xl tracking-tighter leading-none">0300 747524</p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">Send total to this JazzCash number.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-5xl shrink-0">🏠</span>
                    <div>
                      <p className="font-black text-2xl tracking-tighter leading-none">Pay at Door</p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">Pay cash upon delivery. Includes Rs. 300 Fee.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button 
              disabled={loading} 
              className="w-full py-8 bg-blue-600 text-white font-black text-3xl rounded-[2.5rem] shadow-2xl border-b-[12px] border-blue-800 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-tighter leading-none disabled:opacity-50"
            >
              {loading ? 'Vaulting...' : 'Place Order 🔥'}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-12">
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-[8px] border-slate-50 shadow-sm sticky top-32">
            <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter uppercase">Your Haul</h3>
            <div className="space-y-6 mb-10">
              {data.cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center group bg-slate-50 p-5 rounded-[1.5rem] border-2 border-white">
                  <div>
                    <span className="font-black text-slate-800 block text-lg leading-none">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                    <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-1 block">{item.category}</span>
                  </div>
                  <span className="text-slate-900 font-black text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t-4 border-slate-50">
              <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600">FREE 🚚</span>
              </div>
              {paymentMethod === 'Cash on Delivery' && (
                <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
                  <span>COD Handling Fee</span>
                  <span>Rs. 300</span>
                </div>
              )}
              <div className="pt-6 mt-4 border-t-4 border-slate-50 flex justify-between items-end">
                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total Amount</span>
                <span className="text-4xl font-black text-blue-600 tracking-tighter leading-none">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] text-center border-2 border-white">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
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

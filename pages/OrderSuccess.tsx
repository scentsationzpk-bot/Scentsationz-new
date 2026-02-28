import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  
  // Note: Since cart is cleared on addOrder, we don't have items here unless we passed them.
  // In a real app, we'd fetch the order details from Firestore.
  const handleConfirmWhatsApp = () => {
    const number = "+923700162012";
    const message = encodeURIComponent(`Order ID: ${orderId}\n\nI have just placed an order on Scentsationz. Please verify my registry entry for immediate processing. 🏛️💫`);
    window.open(`https://wa.me/${number.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-in zoom-in fade-in duration-700 bg-white selection:bg-slate-900 selection:text-white">
      <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-4 border-slate-900 shadow-2xl relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🏛️</div>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Registry <span className="italic text-slate-400">Vaulted</span></h1>
      <p className="text-slate-500 text-xl mb-12 font-medium max-w-2xl mx-auto uppercase">Your identity is being processed. Our team will verify your details and ship your signature artifact shortly.</p>
      
      <div className="bg-slate-50 p-10 rounded-[3rem] border-4 border-slate-900 mb-16 inline-block shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 block underline underline-offset-4">Reference Reference ID</span>
        <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{orderId}</span>
      </div>
      
      <div className="mb-20">
        <p className="text-slate-900 font-black text-3xl italic leading-tight uppercase">“A masterpiece is headed your way. 🏛️”</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
        <button 
          onClick={handleConfirmWhatsApp}
          className="px-16 py-8 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95 text-xl uppercase tracking-widest border-4 border-slate-900"
        >
          Confirm via WhatsApp 💬
        </button>
        <Link to="/shop" className="text-xl font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors underline underline-offset-8">
          Back to Collection
        </Link>
      </div>

      <div className="mt-32 pt-16 border-t-4 border-slate-50">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Luxury is defined by the silence of precision.</p>
      </div>
    </div>
  );
};

export default OrderSuccess;
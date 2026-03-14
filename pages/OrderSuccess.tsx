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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 selection:bg-slate-900 selection:text-white">
      <div className="max-w-4xl w-full text-center space-y-12 sm:space-y-20 animate-in zoom-in fade-in duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white border-8 border-slate-900 p-10 sm:p-16 rounded-[4rem] sm:rounded-[6rem] shadow-[20px_20px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-7xl sm:text-9xl block animate-bounce">🏛️</span>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-6xl sm:text-9xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">Vaulted.</h1>
          <p className="text-slate-400 text-xl sm:text-3xl font-black uppercase tracking-[0.2em] italic">Your artifact is being prepared for transport.</p>
        </div>

        <div className="bg-slate-50 p-8 sm:p-12 rounded-[3rem] border-4 border-slate-900 inline-block shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
          <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-3 block underline underline-offset-8">Registry Reference</span>
          <span className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter">{orderId}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <button 
            onClick={handleConfirmWhatsApp}
            className="group p-8 sm:p-12 bg-green-500 text-white rounded-3xl sm:rounded-[3rem] border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex flex-col items-center gap-4"
          >
            <span className="text-4xl sm:text-6xl group-hover:scale-110 transition-transform">💬</span>
            <span className="font-black text-xl sm:text-2xl uppercase tracking-tighter">Confirm via WhatsApp</span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80">Priority Verification</span>
          </button>

          <Link 
            to="/shop" 
            className="group p-8 sm:p-12 bg-white text-slate-900 rounded-3xl sm:rounded-[3rem] border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex flex-col items-center gap-4"
          >
            <span className="text-4xl sm:text-6xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="font-black text-xl sm:text-2xl uppercase tracking-tighter">Return to Archive</span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">Continue Exploring</span>
          </Link>
        </div>

        <div className="pt-12 sm:pt-20 border-t-4 border-slate-100">
          <div className="bg-blue-50 p-8 sm:p-12 rounded-[3rem] border-4 border-blue-600 relative overflow-hidden group shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl sm:text-9xl">✨</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tighter uppercase mb-4">Promoter Protocol</h3>
            <p className="text-blue-700 font-black text-xs sm:text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
              Love Scentsationz? Join our Promoter Program and earn 10% commission on every sale you refer.
            </p>
            <Link 
              to="/promoter/signup"
              className="mt-8 sm:mt-10 inline-block px-12 py-6 bg-blue-600 text-white border-4 border-blue-900 rounded-2xl font-black text-xl sm:text-2xl tracking-widest shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
            >
              Join the Elite 🚀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
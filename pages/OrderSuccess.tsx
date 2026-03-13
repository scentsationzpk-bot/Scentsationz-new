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
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-32 text-center animate-in zoom-in fade-in duration-700 bg-white selection:bg-slate-900 selection:text-white">
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 sm:mb-10 border-4 border-slate-900 shadow-2xl relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-12 sm:h-12"><path d="M20 6 9 17l-5-5"/></svg>
        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 text-2xl sm:text-4xl animate-bounce">🏛️</div>
      </div>
      
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tighter uppercase leading-none">Registry <span className="italic text-slate-400">Vaulted</span></h1>
      <p className="text-slate-500 text-lg sm:text-xl mb-8 sm:mb-12 font-medium max-w-2xl mx-auto uppercase">Your identity is being processed. Our team will verify your details and ship your signature artifact shortly.</p>
      
      <div className="bg-slate-50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border-4 border-slate-900 mb-10 sm:mb-16 inline-block shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 sm:mb-2 block underline underline-offset-4">Reference Reference ID</span>
        <span className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">{orderId}</span>
      </div>
      
      <div className="mb-12 sm:mb-20">
        <p className="text-slate-900 font-black text-xl sm:text-3xl italic leading-tight uppercase">“A masterpiece is headed your way. 🏛️”</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-12 sm:mb-16">
        <button 
          onClick={handleConfirmWhatsApp}
          className="w-full sm:w-auto px-8 sm:px-16 py-5 sm:py-8 bg-slate-900 text-white font-black rounded-2xl sm:rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95 text-lg sm:text-xl uppercase tracking-widest border-4 border-slate-900"
        >
          Confirm via WhatsApp 💬
        </button>
        <Link to="/shop" className="text-lg sm:text-xl font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors underline underline-offset-8">
          Back to Collection
        </Link>
      </div>

      {/* Viral Loop: Join Referral Program */}
      <div className="bg-blue-50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border-4 border-blue-600 max-w-3xl mx-auto shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] sm:shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]">
        <h2 className="text-2xl sm:text-3xl font-black text-blue-900 uppercase tracking-tighter mb-3 sm:mb-4">Love Scentsationz? Earn with us! 💸</h2>
        <p className="text-blue-700 font-bold mb-6 sm:mb-8 text-sm sm:text-base">Join our Promoter Program and earn 10% commission on every sale you refer. Get paid directly to your Easypaisa or JazzCash account.</p>
        <Link 
          to="/promoter/signup"
          className="inline-block px-8 sm:px-12 py-4 sm:py-6 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-base sm:text-lg uppercase tracking-widest border-4 border-blue-900"
        >
          Become a Promoter 🚀
        </Link>
      </div>

      <div className="mt-20 sm:mt-32 pt-10 sm:pt-16 border-t-4 border-slate-50">
         <p className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Luxury is defined by the silence of precision.</p>
      </div>
    </div>
  );
};

export default OrderSuccess;
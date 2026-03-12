import React, { useState, useEffect } from 'react';
import { getPromotions } from '../storage';
import { Promotion } from '../types';
import { useToast } from '../App';

const Promotions: React.FC = () => {
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const cloudPromotions = await getPromotions();
        setPromotions(cloudPromotions.filter(p => p.isActive));
      } catch (e) {
        console.error("Failed to fetch promotions", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Promo Code Copied! ✂️', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-xs">Loading Offers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-6 inline-block">Exclusive Offers</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none mt-6">
            Current <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Promotions</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold text-lg max-w-2xl mx-auto">
            Discover our latest deals, limited-time offers, and exclusive bundles. Use the codes below at checkout.
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-4 border-slate-100 animate-in fade-in duration-700">
            <div className="text-6xl mb-6">🎫</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">No Active Promotions</h2>
            <p className="text-slate-500 font-bold">Check back later for exclusive offers and discounts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <div 
                key={promo.id} 
                className="bg-white rounded-[3rem] border-[4px] border-slate-50 overflow-hidden hover:border-blue-600 transition-all duration-700 group flex flex-col shadow-sm animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-10 ${promo.colorClass} text-white flex flex-col items-center text-center space-y-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter uppercase leading-none mb-4">{promo.title}</h3>
                    <p className="font-bold opacity-90 text-sm">{promo.description}</p>
                  </div>
                  
                  <div className="text-6xl font-black tracking-tighter pt-4 relative z-10">
                    {promo.discountPercentage}% <span className="text-2xl opacity-80">OFF</span>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col justify-between space-y-8 bg-white">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b-2 border-slate-50 pb-4">
                      <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Valid Until</span>
                      <span className="font-black text-slate-900">{promo.validUntil || 'Forever'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Use Code at Checkout</p>
                    <button 
                      onClick={() => handleCopyCode(promo.code)}
                      className="w-full py-5 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-lg flex items-center justify-center gap-3 group-hover:bg-blue-50 group-hover:text-blue-600 border-2 border-transparent group-hover:border-blue-100"
                    >
                      {promo.code}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, addToCart } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [isGift, setIsGift] = useState(false);
  const [giftName, setGiftName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [addDairyMilk, setAddDairyMilk] = useState(false);
  const [dairyMilkQuantity, setDairyMilkQuantity] = useState(1);
  const [giftImage, setGiftImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await getProductById(id);
        if (!p) {
          navigate('/shop');
          return;
        }
        setProduct(p);
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGiftImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isAdding, setIsAdding] = useState(false);

  const handleAddAction = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(
      product, 
      quantity, 
      undefined, 
      undefined, 
      isGift ? {
        isGift,
        giftName,
        giftMessage,
        giftImage,
        addDairyMilk,
        dairyMilkQuantity: addDairyMilk ? dairyMilkQuantity : undefined
      } : undefined
    );
    showToast(`${product.name} added to your bag.`, 'success');
    setTimeout(() => setIsAdding(false), 200);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em] mt-4">Extracting...</p>
      </div>
    );
  }

  if (!product) return null;

  const specs = product.specifications || {
    topNotes: ['N/A'], middleNotes: ['N/A'], baseNotes: ['N/A'],
    longevity: 70, sillage: 'Moderate', occasions: ['General']
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-5xl sm:rounded-2xl shadow-none sm:shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col animate-in zoom-in duration-300 border-0 sm:border-4 border-slate-900 max-h-screen sm:max-h-[90vh] relative">
        
        {/* Close Button - Always Visible */}
        <button 
          onClick={() => navigate('/shop')} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] border-2 sm:border-4 border-slate-900 hover:scale-110 active:scale-95 transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform sm:w-6 sm:h-6">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 w-full relative z-0 pb-36 sm:pb-48">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Image */}
            <div className="w-full md:w-1/2 bg-slate-50 flex flex-col items-center justify-center border-b-2 sm:border-b-4 md:border-b-0 md:border-r-4 border-slate-900 p-6 sm:p-8">
              <img 
                src={product.imageUrl ? product.imageUrl.replace('w=800', 'w=600') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'} 
                alt={product.name} 
                loading="lazy"
                className="w-full h-auto max-h-[35vh] md:max-h-none object-contain" 
              />
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 pb-12 flex flex-col items-center text-center bg-white">
              <div className="space-y-3 sm:space-y-6 flex flex-col items-center w-full">
                <span className="text-blue-600 font-black text-[8px] sm:text-[12px] uppercase tracking-widest bg-blue-50 px-3 py-1 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl border-2 sm:border-4 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                  {product.category} Series
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-bold text-slate-400 line-through decoration-red-500 decoration-2">Rs. 7,200</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
                </div>
                <p className="text-slate-500 text-sm sm:text-base font-black max-w-md leading-relaxed">
                  {product.description}
                </p>

                {/* The Story / Vibe */}
                <div className="bg-slate-50 border-l-4 border-blue-600 p-4 sm:p-6 text-left w-full mt-4">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">The Experience</p>
                  <p className="text-slate-700 font-bold text-sm sm:text-base leading-relaxed italic">
                    "{product.luxuryStory || product.description}"
                  </p>
                </div>

                {/* Practical Scenarios */}
                <div className="grid grid-cols-2 gap-4 w-full mt-6 text-left">
                  <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <span className="text-2xl block mb-2">👔</span>
                    <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Best Worn</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{specs.occasions?.join(', ') || 'Evening & Date Nights'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <span className="text-2xl block mb-2">🗣️</span>
                    <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Compliment Factor</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">Extremely High (Room Filler)</p>
                  </div>
                </div>
              </div>
            
              <div className="w-full text-left space-y-4 pt-6 border-t-2 sm:border-t-4 border-slate-900 mt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <input 
                    type="checkbox" 
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="peer appearance-none w-8 h-8 border-4 border-slate-900 rounded-lg checked:bg-blue-600 transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="font-black text-xl uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">Make it a Gift 🎁</span>
              </label>

              {isGift && (
                <div className="space-y-4 animate-in slide-in-from-top-4 p-4 sm:p-6 bg-slate-50 rounded-2xl border-4 border-slate-900">
                  <div className="space-y-2">
                    <label className="font-black text-xs sm:text-sm uppercase tracking-widest text-slate-900">Recipient Name</label>
                    <input 
                      type="text" 
                      value={giftName}
                      onChange={(e) => setGiftName(e.target.value)}
                      className="w-full px-4 py-2 sm:py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
                      placeholder="e.g. Sarah"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-xs sm:text-sm uppercase tracking-widest text-slate-900">Gift Message</label>
                    <textarea 
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-4 py-2 sm:py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600 resize-none h-20 sm:h-24"
                      placeholder="Write your message here..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-xs sm:text-sm uppercase tracking-widest text-slate-900">Add Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    {giftImage && <img src={giftImage} alt="Gift" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-4 border-slate-900 mt-2" />}
                  </div>
                  
                  <div className="pt-4 border-t-4 border-slate-900">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-6 h-6">
                        <input 
                          type="checkbox" 
                          checked={addDairyMilk}
                          onChange={(e) => setAddDairyMilk(e.target.checked)}
                          className="peer appearance-none w-6 h-6 border-4 border-slate-900 rounded-md checked:bg-blue-600 transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest text-slate-900">Add Dairy Milk (+Rs. 50) 🍫</span>
                    </label>
                    
                    {addDairyMilk && (
                      <div className="flex items-center gap-4 mt-4">
                        <span className="font-bold text-sm uppercase tracking-widest text-slate-500">Qty:</span>
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-4 border-slate-900">
                          <button onClick={() => setDairyMilkQuantity(q => Math.max(1, q-1))} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black hover:bg-slate-200">-</button>
                          <span className="font-black w-6 text-center">{dairyMilkQuantity}</span>
                          <button onClick={() => setDairyMilkQuantity(q => q+1)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black hover:bg-slate-200">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="py-5 sm:py-8 border-y-2 sm:border-y-4 border-slate-900 flex flex-col items-center justify-center w-full gap-4 sm:gap-6 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-lg font-bold text-slate-400 line-through decoration-red-500 decoration-2">
                  Rs. {Math.floor(7200).toLocaleString()}
                </span>
                <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                  Rs. {(product.price + (addDairyMilk ? 50 * dairyMilkQuantity : 0)).toLocaleString()}
                </span>
                <span className="text-[8px] sm:text-xs font-black text-white bg-red-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest mt-1 sm:mt-2 animate-pulse">
                  Save Rs. {(7200 - product.price).toLocaleString()}
                </span>
              </div>
               <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q-1))} 
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center font-black border-2 sm:border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-lg sm:text-2xl"
                >
                  -
                </button>
                <span className="font-black text-lg sm:text-2xl px-2 sm:px-4">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q+1)} 
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center font-black border-2 sm:border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-lg sm:text-2xl"
                >
                  +
                </button>
              </div>
            </div>
            </div>
          </div>
          <div className="space-y-4 pt-8 w-full px-8 md:px-12">
            {/* Scarcity & Bundle Incentive */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center bg-red-50 p-2 rounded-xl border-2 border-red-100 animate-pulse">
                <span className="text-xl">🔥</span>
                <p className="text-xs font-black text-red-600 uppercase tracking-widest">
                  Only 2-4 bottles left in stock!
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center bg-blue-50 p-2 rounded-xl border-2 border-blue-100">
                <span className="text-xl">🎁</span>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  Buy 2 get 10% OFF • Buy 3+ get 15% OFF
                </p>
              </div>
            </div>

            {/* Condensed Shipping & Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                  <span className="text-xl">🚀</span> Fast Shipping
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Local</span>
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Same Day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Standard</span>
                    <span className="text-[10px] font-black uppercase text-slate-900">3-5 Days</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                  <span className="text-xl">🛡️</span> Quality
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Concentration</span>
                    <span className="text-[10px] font-black uppercase text-slate-900">40% Extrait</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Maceration</span>
                    <span className="text-[10px] font-black uppercase text-slate-900">60 Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scent Journey Vertical Timeline */}
            <div className="space-y-12 mt-12">
              <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase flex items-center justify-center lg:justify-start gap-4">
                Composition <span className="text-slate-400">🧬</span>
              </h3>
              
              <div className="relative pl-12 space-y-16">
                <div className="absolute left-[22px] top-4 bottom-4 w-1.5 bg-slate-900 rounded-full"></div>

                <div className="relative group">
                  <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-110 transition-transform">🌿</div>
                  <div className="bg-slate-50 p-10 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)]">
                     <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">Initial Contact</h4>
                     <p className="text-slate-500 font-bold text-lg leading-relaxed">{specs.topNotes.join(' • ')}</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-110 transition-transform text-white">🌸</div>
                  <div className="bg-white p-10 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                     <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">The Heart Signature</h4>
                     <p className="text-slate-900 font-bold text-lg leading-relaxed">{specs.middleNotes.join(' • ')}</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-110 transition-transform">🌲</div>
                  <div className="bg-slate-900 p-10 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-white">
                     <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">The Final Trace</h4>
                     <p className="text-slate-400 font-bold text-lg leading-relaxed">{specs.baseNotes.join(' • ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 w-full bg-white border-t-4 sm:border-t-8 border-slate-900 p-4 sm:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-[100] pointer-events-auto shadow-[0_-15px_40px_rgba(0,0,0,0.15)]">
          <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-100 py-2 rounded-xl border-2 border-slate-900">
              <span className="flex items-center gap-1">🛡️ Risk Free</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">⏳ 14+ Hrs</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">🚚 COD Available</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleAddAction} 
                disabled={isAdding}
                className={`flex-1 py-5 sm:py-8 font-black text-xl sm:text-2xl rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 uppercase tracking-widest cursor-pointer touch-manipulation transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-2 active:translate-y-2 ${
                  isAdding 
                    ? 'bg-green-500 text-white border-green-900' 
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isAdding ? 'Added! ✅' : 'Add to Bag 🛍️'}
              </button>
              
              <button 
                onClick={() => { handleAddAction(); navigate('/checkout'); }} 
                className="flex-[1.5] py-5 sm:py-8 bg-blue-600 text-white font-black text-xl sm:text-2xl rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 uppercase tracking-widest cursor-pointer touch-manipulation hover:bg-blue-700 active:bg-blue-800 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-2 active:translate-y-2 flex flex-col items-center justify-center leading-none animate-pulse"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>Order Now - Risk Free</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
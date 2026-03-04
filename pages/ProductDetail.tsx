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

  const handleAddAction = () => {
    if (!product) return;
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
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Authenticating Assets...</p>
      </div>
    );
  }

  if (!product) return null;

  const specs = product.specifications || {
    topNotes: ['N/A'], middleNotes: ['N/A'], baseNotes: ['N/A'],
    longevity: 70, sillage: 'Moderate', occasions: ['General']
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col animate-in zoom-in duration-300 border-4 border-slate-900 max-h-[90vh] relative">
        
        {/* Close Button - Always Visible */}
        <button 
          onClick={() => navigate('/shop')} 
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-grow">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Image */}
            <div className="w-full md:w-1/2 bg-slate-50 flex flex-col items-center justify-start border-b-4 md:border-b-0 md:border-r-4 border-slate-900 p-8">
              <img 
                src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'} 
                alt={product.name} 
                className="w-full h-auto object-contain mb-8" 
              />
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 pb-48 flex flex-col items-center text-center bg-white">
              <div className="space-y-6 flex flex-col items-center w-full">
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-widest bg-blue-50 px-6 py-2 rounded-xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              {product.category} Series
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
              {product.name}
            </h2>
            <p className="text-slate-500 text-lg font-black max-w-xs leading-relaxed">
              {product.description}
            </p>
            
            <div className="w-full text-left space-y-4 pt-6 border-t-4 border-slate-900">
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
                <div className="space-y-4 animate-in slide-in-from-top-4 p-6 bg-slate-50 rounded-2xl border-4 border-slate-900">
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase tracking-widest text-slate-900">Recipient Name</label>
                    <input 
                      type="text" 
                      value={giftName}
                      onChange={(e) => setGiftName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
                      placeholder="e.g. Sarah"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase tracking-widest text-slate-900">Gift Message</label>
                    <textarea 
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600 resize-none h-24"
                      placeholder="Write your message here..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase tracking-widest text-slate-900">Add Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    {giftImage && <img src={giftImage} alt="Gift" className="w-24 h-24 object-cover rounded-xl border-4 border-slate-900 mt-2" />}
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

            <div className="py-8 border-y-4 border-slate-900 flex flex-col items-center justify-center w-full gap-6">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-slate-400 line-through decoration-red-500 decoration-2">
                  Rs. {Math.floor(7200).toLocaleString()}
                </span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  Rs. {(product.price + (addDairyMilk ? 50 * dairyMilkQuantity : 0)).toLocaleString()}
                </span>
                <span className="text-xs font-black text-white bg-red-500 px-3 py-1 rounded-full uppercase tracking-widest mt-2 animate-pulse">
                  Save Rs. {(7200 - product.price).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q-1))} 
                  className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-2xl"
                >
                  -
                </button>
                <span className="font-black text-2xl px-4">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q+1)} 
                  className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-2xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-8 w-full">
            {/* Scarcity & Bundle Incentive */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center bg-red-50 p-2 rounded-xl border-2 border-red-100 animate-pulse">
                <span className="text-xl">🔥</span>
                <p className="text-xs font-black text-red-600 uppercase tracking-widest">
                  Only {Math.floor(Math.random() * 3) + 1} bottles left in stock!
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center bg-blue-50 p-2 rounded-xl border-2 border-blue-100">
                <span className="text-xl">🎁</span>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  Buy 2 get 10% OFF • Buy 3+ get 15% OFF
                </p>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="w-full bg-slate-50 rounded-2xl p-6 border-4 border-slate-100 mt-4 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2 relative z-10">
                  <span className="text-xl">🚀</span> Express Logistics
                </h4>
                <div className="relative pl-4 border-l-4 border-slate-200 space-y-6 z-10">
                  <div className="relative">
                    <div className="absolute -left-[22px] top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm animate-pulse"></div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Rawalpindi & Islamabad</p>
                    <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded w-fit">⚡ 1-Hour Delivery</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[22px] top-1 w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Nationwide</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">📦 3-5 Working Days</p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-xl flex items-center gap-3 border-2 border-green-100 relative z-10">
                   <span className="text-xl">💳</span>
                   <div>
                     <p className="font-black text-green-800 text-[10px] uppercase tracking-widest">JazzCash Exclusive</p>
                     <p className="text-[10px] font-bold text-green-600">Get Rs. 200 OFF instantly at checkout!</p>
                   </div>
                </div>
            </div>


          </div>

          <div className="w-full mt-10 pt-8 border-t-4 border-slate-900 text-left space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">The Scentsationz Promise</h3>
            <div className="bg-slate-50 rounded-[2rem] p-8 border-4 border-slate-100 space-y-8">
              
              {/* Trust Item 1 */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border-4 border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🚚
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Free Nationwide Delivery</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    We cover 100% of the shipping costs. The price you see is the price you pay. No surprises at checkout.
                  </p>
                </div>
              </div>

              {/* Trust Item 2 */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border-4 border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🛡️
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Founder's Quality Seal</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    "I personally test every batch. If it doesn't last 10+ hours, it doesn't leave the vault." — The Founder (13yo)
                  </p>
                </div>
              </div>

              {/* Trust Item 3 */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border-4 border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  💧
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Extrait de Parfum (35-40%)</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    Not an Eau de Toilette. This is pure perfume oil concentration for maximum projection and longevity.
                  </p>
                </div>
              </div>

              {/* Trust Item 4 */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border-4 border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  📦
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Safe Arrival Guarantee</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    If your bottle arrives damaged, we replace it instantly. No questions asked. Your trust is our priority.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="w-full mt-10 pt-8 border-t-4 border-slate-900 text-left space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest border-b-4 border-slate-900 pb-2">Composition</h3>
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-1 before:bg-slate-200">
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="font-black text-slate-900 uppercase text-sm tracking-widest block mb-1">Top Notes</span>
                <p className="text-slate-600 font-bold text-sm">{specs.topNotes.join(', ')}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 font-bold">0 - 15 Minutes</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="font-black text-slate-900 uppercase text-sm tracking-widest block mb-1">Heart Notes</span>
                <p className="text-slate-600 font-bold text-sm">{specs.middleNotes.join(', ')}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 font-bold">15 Mins - 4 Hours</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="font-black text-slate-900 uppercase text-sm tracking-widest block mb-1">Base Notes</span>
                <p className="text-slate-600 font-bold text-sm">{specs.baseNotes.join(', ')}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 font-bold">4 - 10+ Hours</p>
              </div>
            </div>
          </div>

          <div className="w-full mt-10 pt-8 border-t-4 border-slate-900 text-left space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest border-b-4 border-slate-900 pb-2">A Note from the Founder</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-900 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
               <div className="relative z-10">
                 <p className="text-lg font-black text-slate-900 mb-4">"Age is just a number. Passion is everything."</p>
                 <p className="text-sm font-bold text-slate-600 leading-relaxed mb-4">
                   Hi, I'm the 13-year-old founder of Scentsationz. I started this journey with a simple dream: to prove that world-class luxury doesn't need a designer label. Every bottle is crafted with the same obsession for quality that I pour into my own future. When you choose Scentsationz, you're not just buying a perfume; you're supporting a young dreamer's vision to redefine excellence in Pakistan.
                 </p>
                 <div className="flex items-center gap-3 mt-6">
                   <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">F</div>
                   <div>
                     <p className="font-black text-slate-900 text-xs uppercase tracking-widest">The Founder</p>
                     <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Scentsationz</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t-4 border-slate-100 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] space-y-3">
          <button 
            onClick={handleAddAction} 
            className="w-full py-4 border-4 border-slate-900 text-slate-900 font-black text-lg rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Add to Bag 🛍️
          </button>
          <button 
            onClick={() => { handleAddAction(); navigate('/checkout'); }} 
            className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-blue-700 transition-all uppercase tracking-widest border-4 border-slate-900"
          >
            Checkout Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
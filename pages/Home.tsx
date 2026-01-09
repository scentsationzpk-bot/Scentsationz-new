import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, addToCart } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const QuickViewModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to bag! 🛍️`, 'success');
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300 border-4 border-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="w-full md:w-1/2 aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-slate-900">
          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-full h-full object-contain p-8" />
          <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-between bg-white text-center items-center">
          <div className="space-y-8 flex flex-col items-center w-full">
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-widest bg-blue-50 px-6 py-2 rounded-xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              {product.category} Series
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">{product.name}</h2>
            <p className="text-slate-500 text-lg font-black max-w-xs leading-relaxed">{product.description}</p>
            
            <div className="py-10 border-y-4 border-slate-900 flex flex-col items-center justify-center w-full gap-6">
              <span className="text-4xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
              <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-2xl">-</button>
                <span className="font-black text-2xl px-4">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black border-4 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-2xl">+</button>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-10 w-full">
            <button onClick={handleAddToCart} className="w-full py-6 border-4 border-slate-900 text-slate-900 font-black text-xl rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1">Add to Bag 🛍️</button>
            <button onClick={handleBuyNow} className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:bg-blue-700 transition-all uppercase tracking-widest border-4 border-slate-900">Checkout Now 🚀</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceDNA: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-32 space-y-20 text-center">
      <div className="space-y-4">
        <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">Performance <span className="text-blue-600 italic">DNA</span></h2>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">The Science of Superiority</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 max-w-6xl mx-auto">
        <div className="bg-[#F8F9FB] p-12 rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.1)] flex flex-col items-center text-center space-y-10 group hover:-translate-y-2 transition-transform duration-500">
          <div className="w-20 h-20 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">💤</div>
          <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter">Ordinary Brands</h3>
          <ul className="space-y-6 w-full">
            {['Low oil concentration (10-15%)', 'Fades in 3-4 hours', 'Synthetic harsh chemicals', 'Generic mass-market profiles'].map((item, i) => (
              <li key={i} className="flex items-center justify-center gap-4 text-slate-400 font-black text-lg uppercase leading-tight">
                <span className="text-red-400 text-3xl font-black">✕</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0D1F3C] p-12 rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] text-white flex flex-col items-center text-center space-y-10 group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
          <div className="w-20 h-20 bg-blue-600 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative z-10">🧪</div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-blue-400 relative z-10">Scentsationz Elite</h3>
          <ul className="space-y-6 w-full relative z-10">
            {['Extrait de Parfum (35-40%)', '14+ hours of active scent', 'Natural premium absolutes', 'Original identity signatures'].map((item, i) => (
              <li key={i} className="flex items-center justify-center gap-4 font-black text-lg uppercase leading-tight">
                <span className="text-green-400 text-3xl font-black">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const SignatureMoods: React.FC = () => {
  return (
    <section className="bg-[#F8F9FB] py-32 px-4 border-y-8 border-slate-900">
      <div className="max-w-7xl mx-auto space-y-20 text-center">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">Signature <span className="text-blue-600 italic">Moods</span></h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Design Your Olfactory Aura</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { title: "Confidence", icon: "👑", desc: "Command the room." },
            { title: "Mystery", icon: "🌑", desc: "Leave them curious." },
            { title: "Elegance", icon: "💎", desc: "Timeless grace." }
          ].map((mood, i) => (
            <div key={i} className="bg-white p-12 rounded-2xl border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center space-y-6 group hover:-translate-y-4 transition-all duration-500">
              <div className="text-7xl group-hover:scale-125 transition-transform duration-500">{mood.icon}</div>
              <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{mood.title}</h4>
              <p className="text-slate-400 font-black text-sm uppercase tracking-widest">{mood.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CommunityVerdict: React.FC = () => {
  return (
    <section className="bg-white py-32 px-4 text-center">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">Community <span className="text-blue-600 italic">Verdict</span></h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Real Stories From The Registry</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: "Ahmed", city: "Lahore", text: "Finally found a scent that lasts through the Lahore heat. Starborn is a beast!", rating: 5 },
            { name: "Sara", city: "Karachi", text: "The presentation and quality is better than most designer brands I own.", rating: 5 },
            { name: "Usman", city: "Islamabad", text: "Fast delivery and the scent profile is so unique. Definitely buying again.", rating: 5 }
          ].map((rev, i) => (
            <div key={i} className="bg-white p-12 rounded-2xl border-4 border-slate-900 space-y-8 flex flex-col justify-between hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] items-center min-h-[350px]">
              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[...Array(rev.rating)].map((_, j) => (
                    <span key={j} className="text-blue-600 text-2xl font-black">★</span>
                  ))}
                </div>
                <p className="text-slate-900 font-black text-2xl leading-tight tracking-tight italic">"{rev.text}"</p>
              </div>
              <div className="w-full pt-8 border-t-4 border-slate-50">
                <p className="text-slate-900 font-black uppercase text-sm tracking-widest">{rev.name}</p>
                <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">{rev.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      setProducts(p);
    };
    fetch();
  }, []);

  return (
    <div className="animate-in fade-in duration-700 bg-white selection:bg-blue-600 selection:text-white">
      {/* Massive Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-4 border-b-[12px] border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-16 flex flex-col items-center w-full max-w-7xl">
          <div className="inline-block px-6 py-3 border-4 border-slate-900 rounded-full mb-4 bg-blue-50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-[0.6em] block">Signature Scent Lab • 2026</span>
          </div>
          <h1 className="text-7xl sm:text-9xl md:text-[14rem] font-black text-slate-900 tracking-tighter leading-[0.75] mb-8 uppercase text-center">
            The <span className="text-blue-600 italic">Elite</span> Standard
          </h1>
          <p className="text-slate-400 text-2xl md:text-5xl font-black max-w-5xl mx-auto tracking-tighter leading-none text-center uppercase">
            Extrait de Parfum concentrations. <br className="hidden md:block"/> Engineered for the <span className="text-slate-900">1%</span>. 🧪
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-10 w-full px-4">
            <Link to="/shop" className="group w-full sm:w-auto px-20 py-10 bg-blue-600 text-white font-black rounded-[2rem] text-4xl hover:scale-105 active:scale-95 transition-all shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 uppercase tracking-tighter text-center">
              Enter The Vault 🛍️
            </Link>
          </div>
        </div>
      </section>

      {/* Performance DNA Section */}
      <PerformanceDNA />

      {/* Signature Mood Section */}
      <SignatureMoods />

      {/* Featured Vault Drops */}
      <section className="max-w-7xl mx-auto px-4 py-40 space-y-24 text-center">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-none">Vault <span className="text-blue-600 italic">Favorites</span></h2>
          <p className="text-slate-400 text-xl font-black uppercase tracking-[0.4em] text-sm">Batch Availability • Price Locked: Rs. 2,250</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="group bg-white rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all h-full flex flex-col items-center text-center">
              <div className="aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900 w-full overflow-hidden">
                <img src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-full h-full object-contain p-10 group-hover:scale-125 transition-transform duration-[2s]" />
                <button onClick={() => setQuickViewProduct(product)} className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-blue-600 hover:text-white">Quick View</button>
              </div>
              <div className="p-10 space-y-6 w-full flex flex-col items-center">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h3>
                <div className="pt-8 border-t-4 border-slate-50 flex items-center justify-between w-full">
                  <span className="text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
                  <button onClick={() => { addToCart(product, 1); showToast(`${product.name} added! 🛍️`); }} className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-16">
          <Link to="/shop" className="px-20 py-8 border-4 border-slate-900 rounded-2xl font-black uppercase tracking-[0.3em] text-lg hover:bg-slate-900 hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">View Entire Vault</Link>
        </div>
      </section>

      {/* Community Verdict Section */}
      <CommunityVerdict />

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 py-40 pb-60 text-center">
          <div className="bg-slate-900 rounded-2xl p-20 md:p-32 text-white border-[10px] border-blue-600 shadow-[25px_25px_0px_0px_rgba(37,99,235,0.2)] space-y-16 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 animate-pulse pointer-events-none"></div>
              <h2 className="text-5xl md:text-[8rem] font-black tracking-tighter leading-none uppercase relative z-10">Join The <span className="text-blue-500 italic">Registry</span></h2>
              <p className="text-slate-400 text-2xl md:text-4xl max-w-3xl font-black uppercase tracking-tight relative z-10 leading-none">Be the first to know when limited batches drop. <br/><span className="text-white">Free Nationwide Shipping</span> on every bottle.</p>
              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl relative z-10">
                 <input type="email" placeholder="YOUR BEST EMAIL" className="flex-grow bg-slate-800 border-4 border-slate-700 rounded-2xl px-10 py-6 text-2xl font-black focus:border-blue-500 outline-none uppercase text-center text-white placeholder:text-slate-600" />
                 <button className="px-16 py-6 bg-blue-600 text-white font-black rounded-2xl text-2xl uppercase tracking-widest hover:bg-blue-700 transition-all border-b-[12px] border-blue-900 active:translate-y-2 active:border-b-0 shadow-2xl">Access</button>
              </div>
          </div>
      </section>

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
};

export default Home;
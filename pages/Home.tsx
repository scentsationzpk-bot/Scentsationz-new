import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getStoreDataSync } from '../storage';
import { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(getStoreDataSync().products);

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      setProducts(p);
    };
    fetch();

    const handleUpdate = () => {
      fetch();
    };

    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  return (
    <div className="animate-in fade-in duration-700 bg-white selection:bg-blue-900 selection:text-white">
      {/* Luxury Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-4 border-b-[12px] border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-blue-900/[0.02] rounded-full blur-[160px] pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-16 flex flex-col items-center w-full max-w-7xl">
          <div className="inline-block px-6 py-3 border-4 border-slate-900 rounded-full mb-4 bg-blue-50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-[0.6em] block">Signature Scent Lab • 2026</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-9xl md:text-[14rem] font-black text-slate-900 tracking-tighter leading-[0.75] mb-8 uppercase text-center">
              The <span className="text-blue-600 italic">Elite</span> Standard
            </h1>
          </div>
          <p className="text-slate-400 text-2xl md:text-5xl font-black max-w-5xl mx-auto tracking-tighter leading-none text-center uppercase">
            Extrait de Parfum concentrations. <br className="hidden md:block"/> Engineered for the <span className="text-slate-900">1%</span>. 🧪
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-10 w-full px-4">
            <Link 
              to="/shop"
              className="group w-full sm:w-auto px-20 py-10 bg-blue-600 text-white font-black rounded-[2rem] text-4xl hover:scale-105 active:scale-95 transition-all shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 uppercase tracking-tighter text-center"
            >
              Enter The Vault 🛍️
            </Link>
          </div>
        </div>
      </section>

      {/* Performance DNA */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-20 text-center">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Performance <span className="text-blue-600 italic">DNA</span>
          </h2>
          <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">The Science of Superiority</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 max-w-6xl mx-auto">
          <div className="bg-[#F8F9FB] p-12 rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.1)] flex flex-col items-center text-center space-y-10 group hover:-translate-y-2 transition-transform duration-500">
            <div className="w-20 h-20 bg-blue-600 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative z-10">🧪</div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-blue-400 relative z-10">Scentsationz Elite</h3>
            <ul className="space-y-6 w-full relative z-10">
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Extrait de Parfum (35-40%)</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">14+ hours of active scent</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Natural premium absolutes</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Original identity signatures</li>
            </ul>
          </div>
          <div className="bg-white p-12 rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center space-y-10 group hover:-translate-y-2 transition-transform duration-500">
            <div className="w-20 h-20 bg-slate-100 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative z-10">📉</div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-400 relative z-10">Standard Designer</h3>
            <ul className="space-y-6 w-full relative z-10 text-slate-400">
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Eau de Parfum (15-20%)</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">4-6 hours of active scent</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Synthetic aroma chemicals</li>
              <li className="flex items-center justify-center gap-4 font-black text-lg uppercase">Mass-market DNA</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Private Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-24 text-center">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-none">The <span className="text-blue-600 italic">Registry</span></h2>
          <p className="text-slate-500 text-xl font-black uppercase tracking-[0.4em] text-sm">Limited units per batch availability</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl border-4 border-slate-900 shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] overflow-hidden hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all h-full flex flex-col items-center text-center relative">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-slate-900">
                  {product.tier || 'Private Series'}
                </span>
              </div>
              <div className="aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900 w-full overflow-hidden">
                <img 
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-12 group-hover:scale-125 transition-transform duration-[2s] grayscale hover:grayscale-0" 
                />
              </div>
              <div className="p-12 space-y-8 w-full flex flex-col items-center">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h3>
                <div className="pt-8 border-t-4 border-slate-50 flex flex-col items-center w-full gap-6">
                  <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em]">Access Restricted</span>
                  <Link 
                    to={`/product/${product.id}`}
                    className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase tracking-widest text-sm"
                  >
                    View Specifications
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Verdict */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-24 text-center">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Community <span className="text-blue-600 italic">Verdict</span>
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Real Stories From The Registry</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {name:"Ahmed",city:"Lahore",text:"Finally found a scent that lasts through the Lahore heat. Starborn is a beast!",rating:5},
            {name:"Sara",city:"Karachi",text:"The presentation and quality is better than most designer brands I own.",rating:5},
            {name:"Usman",city:"Islamabad",text:"Fast delivery and the scent profile is so unique. Definitely buying again.",rating:5}
          ].map((i,e) => (
            <div key={e} className="bg-white p-12 rounded-2xl border-4 border-slate-900 space-y-8 flex flex-col justify-between hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] items-center min-h-[300px]">
              <div className="flex space-x-1 text-blue-600 text-2xl">
                {"★".repeat(i.rating)}
              </div>
              <p className="text-xl font-black text-slate-900 italic leading-relaxed">"{i.text}"</p>
              <div className="space-y-1">
                <p className="font-black uppercase tracking-widest text-slate-900">{i.name}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{i.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
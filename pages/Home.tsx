import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getStoreDataSync } from '../storage';
import { Product } from '../types';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(getStoreDataSync().products);
  const [loading, setLoading] = useState(getStoreDataSync().products.length === 0);

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      setProducts(p.slice(0, 5));
      setLoading(false);
    };
    fetch();

    const handleUpdate = () => {
      fetch();
    };

    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-900 font-black uppercase text-xs tracking-widest">Syncing Vault...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white selection:bg-blue-900 selection:text-white"
    >
      {/* Luxury Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden bg-white border-b-[8px] sm:border-b-[12px] border-slate-900">
        {/* Left Content Side */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 sm:py-24 lg:py-0 space-y-8 sm:space-y-12 relative z-10 bg-white">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6 sm:space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3 border-2 sm:border-4 border-slate-900 rounded-xl sm:rounded-2xl bg-blue-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-[0.3em]">Elite Perfumery • Est. 2026</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl sm:text-9xl lg:text-[13rem] font-black text-slate-900 tracking-tighter leading-[0.75] uppercase">
                SCENT<br />
                <span className="text-blue-600 italic">SATIONZ</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-6 w-32 sm:w-64 bg-blue-600 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"></div>
                <span className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">The New Standard</span>
              </div>
            </div>

            <p className="text-slate-900 text-2xl sm:text-4xl md:text-5xl font-black max-w-2xl tracking-tighter leading-[0.9] uppercase italic">
              "We don't sell perfume. We sell <span className="text-blue-600">absolute presence</span>."
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-4">
              <Link 
                to="/shop"
                className="group flex items-center justify-center gap-3 px-8 py-5 sm:px-12 sm:py-8 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl text-xl sm:text-3xl hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 uppercase tracking-tighter text-center"
              >
                Enter The Vault
                <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Visual Side - Immersive Story Panel */}
        <div className="flex-1 relative min-h-[600px] lg:min-h-0 border-t-[8px] lg:border-t-0 lg:border-l-[12px] border-slate-900 bg-slate-900 overflow-hidden flex items-center justify-center p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.2),_transparent_70%)]"></div>
          
          <div className="relative z-10 text-center space-y-12 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 px-6 py-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-blue-300 font-black tracking-[0.4em] uppercase text-[12px]">The Olfactory Manifesto</span>
            </div>
            
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
              Scent is <br/><span className="text-blue-500 italic">Violence.</span>
            </h2>
            
            <p className="text-slate-300 font-bold text-lg sm:text-xl leading-relaxed italic">
              "A fragrance should not ask for permission. It should demand recognition. We engineered Scentsationz for the disruptors, the dreamers, and the dangerously ambitious."
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="p-6 border-4 border-slate-700 bg-slate-800/30 rounded-3xl text-left space-y-2">
                <span className="text-3xl block">🌑</span>
                <p className="font-black text-white uppercase tracking-widest text-xs">Midnight Drive</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase">Cold Air & Smoked Wood</p>
              </div>
              <div className="p-6 border-4 border-slate-700 bg-slate-800/30 rounded-3xl text-left space-y-2">
                <span className="text-3xl block">🔥</span>
                <p className="font-black text-white uppercase tracking-widest text-xs">Aura of Power</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase">Aged Leather & Vanilla</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section - The Molecular Edge */}
      <section className="max-w-7xl mx-auto px-4 py-24 sm:py-40 border-b-4 border-slate-900 relative">
        {/* Vertical Rail Text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block">
          <p className="writing-mode-vertical-rl rotate-180 text-[10px] font-black uppercase tracking-[1em] text-slate-200">
            Molecular Engineering • Olfactory Artifacts • Elite Concentration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Feature Highlight */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-blue-600 rounded-[3rem] p-10 sm:p-20 border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/20 border-2 border-white/30 px-6 py-3 rounded-full">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-black tracking-[0.5em] uppercase text-[12px]">The Molecular Edge</span>
              </div>
              <h2 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                40% PURE <br/><span className="italic text-blue-200">EXTRAIT.</span>
              </h2>
              <p className="text-blue-50 font-bold text-xl sm:text-2xl leading-tight max-w-2xl">
                While industry giants dilute their formulas to 15%, we engineer our artifacts at a massive 40% concentration. This isn't just perfume; it's a molecular statement that commands attention for 14+ hours.
              </p>
              <div className="pt-12 grid grid-cols-2 gap-12 border-t-4 border-white/20">
                <div className="space-y-2">
                  <span className="text-4xl sm:text-6xl font-black">14h+</span>
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Active Projection</p>
                </div>
                <div className="space-y-2">
                  <span className="text-4xl sm:text-6xl font-black">ZERO</span>
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Synthetic Fillers</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Private Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:py-32 space-y-16 sm:space-y-24 border-b-4 border-slate-900">
        <div className="space-y-4 sm:space-y-8 text-center">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">The <span className="text-blue-600 italic">Signature</span> Collection</h2>
          <p className="text-slate-500 text-sm sm:text-xl font-black uppercase tracking-[0.4em]">Exclusivity in every drop. Limited batch releases.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-slate-900 border-4 border-slate-900 rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-white">
          {products.map((product, index) => {
            // Generate a consistent rating between 4.2 and 4.98 based on product id or index
            const rating = (4.2 + (Math.abs(product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 78) / 100).toFixed(2);
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={product.id} 
                className={`group flex flex-col relative hover:bg-slate-50 transition-colors ${
                  index > 0 && index % 3 !== 0 ? 'lg:border-l-4 border-slate-900' : ''
                } ${
                  index >= 3 ? 'lg:border-t-4 border-slate-900' : ''
                }`}
              >
                <div className="aspect-square bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                    </div>
                  </div>
                  <img 
                    src={product.imageUrl ? product.imageUrl.replace('w=800', 'w=600') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=60&w=600'} 
                    alt={`Luxury perfume bottle: ${product.name}`} 
                    loading="lazy"
                    className="w-full h-full object-contain p-8 sm:p-12 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  />
                </div>
                <div className="p-8 sm:p-12 space-y-4 sm:space-y-6 flex flex-col justify-between flex-grow items-center text-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(Number(rating)) ? 'fill-blue-600 text-blue-600' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">{rating} / 5.0</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h3>
                    <p className="text-slate-500 font-bold text-sm sm:text-base leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                  <div className="pt-6 sm:pt-8 border-t-4 border-slate-100 flex flex-col items-center w-full gap-6 sm:gap-8 mt-auto">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-lg font-bold text-slate-400 line-through decoration-red-500 decoration-2">Rs. 12,000</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                        Save Rs. {(12000 - product.price).toLocaleString()}
                      </div>
                    </div>
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-full py-4 sm:py-5 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all uppercase tracking-widest text-xs sm:text-sm"
                    >
                      Enter The Vault
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>


      {/* Contact Form */}
      <ContactForm />
    </motion.div>
  );
};

export default Home;

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
              <h1 className="text-7xl sm:text-9xl lg:text-[11rem] font-black text-slate-900 tracking-tighter leading-[0.8] uppercase">
                SCENT<br />
                <span className="text-blue-600 italic">SATIONZ</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 sm:w-48 bg-blue-600 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"></div>
                <span className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">Authentic Artifacts</span>
              </div>
            </div>

            <p className="text-slate-500 text-lg sm:text-2xl md:text-3xl font-bold max-w-xl tracking-tight leading-tight uppercase italic">
              "The scent of absolute power. Engineered for those who demand the extraordinary."
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-4">
              <Link 
                to="/shop"
                className="group flex items-center justify-center gap-3 px-8 py-5 sm:px-12 sm:py-6 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl text-lg sm:text-2xl hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 uppercase tracking-tighter text-center"
              >
                Enter The Vault
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/about"
                className="group flex items-center justify-center gap-3 px-8 py-5 sm:px-12 sm:py-6 bg-white text-slate-900 font-black rounded-xl sm:rounded-2xl text-lg sm:text-2xl hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 uppercase tracking-tighter text-center"
              >
                Our Identity
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t-4 border-slate-50">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">40%</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Concentration</span>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">14h+</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Longevity</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Visual Side - Immersive Story Panel */}
        <div className="flex-1 relative min-h-[500px] lg:min-h-0 border-t-[8px] lg:border-t-0 lg:border-l-[12px] border-slate-900 bg-slate-900 overflow-hidden flex items-center justify-center p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.15),_transparent_70%)]"></div>
          
          {/* Animated floating orbs to represent notes */}
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-[60px]"
          ></motion.div>
          <motion.div 
            animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-slate-400 rounded-full blur-[80px]"
          ></motion.div>

          <div className="relative z-10 text-center space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-blue-300 font-black tracking-[0.4em] uppercase text-[10px]">The Olfactory Experience</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              Close your eyes.<br/>Feel the <span className="text-blue-500 italic">Aura.</span>
            </h2>
            
            <p className="text-slate-300 font-bold text-sm sm:text-base leading-relaxed">
              Imagine the crisp air of a midnight drive, the warmth of aged leather, and the magnetic pull of smoked vanilla. Our extraits don't just smell good—they tell your story before you even speak.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <span className="px-4 py-2 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-xl text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest">Smoked Vanilla</span>
              <span className="px-4 py-2 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-xl text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest">Aged Leather</span>
              <span className="px-4 py-2 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-xl text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest">Dark Woods</span>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32 border-b-4 border-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center space-y-4 sm:space-y-6 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 text-white rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Pure Extrait</h3>
              <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em]">40% Oil Concentration</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center space-y-4 sm:space-y-6 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white text-blue-600 rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Eternal Sillage</h3>
              <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em]">14+ Hours Performance</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-4 sm:space-y-6 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 text-white rounded-2xl sm:rounded-[2rem] border-4 border-slate-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] sm:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Niche Quality</h3>
              <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em]">Hand-Selected Ingredients</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blind-Buy Confidence Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 border-b-4 border-slate-900">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="w-full bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 border-4 border-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="relative z-10 space-y-4 md:max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border-2 border-blue-500/30 px-4 py-2 rounded-full mb-2">
              <span className="text-blue-400 font-black tracking-[0.4em] uppercase text-[10px]">Zero Hesitation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              The Ultimate <span className="text-blue-400 italic">Blind Buy</span>
            </h2>
            <p className="text-slate-300 font-bold text-sm sm:text-lg leading-relaxed">
              Hesitant to buy perfume online? We've engineered our scent profiles to be universally magnetic. By blending high-quality, recognizable notes at a massive <span className="bg-blue-600/30 px-2 py-1 rounded text-blue-300 font-black">40% Extrait concentration</span>, we guarantee a compliment-pulling masterpiece.
            </p>
            <p className="text-slate-400 font-bold text-xs sm:text-sm">
              No synthetic alcohol blasts. Just pure, smooth, room-filling sillage from the first spray to the 14th hour. Command the room with absolute confidence.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-blue-600 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-5xl sm:text-6xl">🎯</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* The Scentsationz Standard */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24 border-b-4 border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            The Scentsationz <span className="text-blue-600 italic">Standard</span>
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs sm:text-sm">Why we stand above the rest</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 sm:p-12 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-2xl font-black">01</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Small Batch Production</h3>
            <p className="text-slate-600 font-bold leading-relaxed">
              We don't mass produce. Every fragrance is blended in small, controlled batches to ensure absolute consistency and the highest quality control possible.
            </p>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-50 p-8 sm:p-12 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-2xl font-black">02</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">60-Day Maceration</h3>
            <p className="text-slate-600 font-bold leading-relaxed">
              Patience is our secret ingredient. We let our oils steep and mature for a full 60 days before bottling, resulting in a smoother, richer, and longer-lasting scent profile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Private Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:py-32 space-y-16 sm:space-y-24">
        <div className="space-y-4 sm:space-y-8 text-center">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">The <span className="text-blue-600 italic">Signature</span> Collection</h2>
          <p className="text-slate-500 text-sm sm:text-xl font-black uppercase tracking-[0.4em]">Exclusivity in every drop. Limited batch releases.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {products.map((product, index) => {
            // Generate a consistent rating between 4.2 and 4.98 based on product id or index
            const rating = (4.2 + (Math.abs(product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 78) / 100).toFixed(2);
            
            return (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                key={product.id} 
                className={`group bg-white rounded-[2rem] sm:rounded-[3rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] sm:shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex flex-col relative ${
                  index === 0 ? 'lg:col-span-2 lg:flex-row' : ''
                }`}
              >
                <div className={`aspect-square bg-slate-50 relative flex items-center justify-center border-slate-900 overflow-hidden ${
                  index === 0 ? 'lg:w-1/2 lg:border-r-4' : 'w-full border-b-4'
                }`}>
                  <img 
                    src={product.imageUrl ? product.imageUrl.replace('w=800', 'w=600') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=60&w=600'} 
                    alt={`Luxury perfume bottle: ${product.name}`} 
                    loading="lazy"
                    className="w-full h-full object-contain p-8 sm:p-12 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  />
                </div>
                <div className={`p-8 sm:p-12 space-y-4 sm:space-y-6 flex flex-col justify-center ${index === 0 ? 'lg:w-1/2' : 'w-full'} items-center text-center`}>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(Number(rating)) ? 'fill-blue-600 text-blue-600' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-900">{rating} / 5.0</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h3>
                  <p className="text-slate-500 font-bold text-base sm:text-lg leading-relaxed line-clamp-2">{product.description}</p>
                  <div className="pt-6 sm:pt-8 border-t-4 border-slate-50 flex flex-col items-center w-full gap-6 sm:gap-8">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-1 sm:mb-2">Limited Availability</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-lg font-bold text-slate-400 line-through decoration-red-500 decoration-2">Rs. 7,200</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-full py-5 sm:py-6 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase tracking-widest text-xs sm:text-sm"
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


      {/* Community Verdict */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-32 space-y-12 sm:space-y-24 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Community <span className="text-blue-600 italic">Verdict</span>
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[8px] sm:text-sm">Real Stories From The Registry</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {[
            {name:"Hassan",city:"Lahore",text:"The complexity of these extraits is staggering. Starborn has become my signature scent.",rating:5},
            {name:"Areeb",city:"Karachi",text:"Unmatched longevity. I can still smell the base notes after a full day in the Karachi humidity.",rating:5},
            {name:"Faheem",city:"Islamabad",text:"The presentation is pure luxury. Scentsationz is easily competing with the top niche houses.",rating:5}
          ].map((i,e) => (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: e * 0.1 }}
              key={e} 
              className="bg-white p-6 sm:p-12 rounded-2xl border-2 sm:border-4 border-slate-900 space-y-4 sm:space-y-8 flex flex-col justify-between hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] items-center min-h-[220px] sm:min-h-[300px]"
            >
              <div className="flex space-x-1 text-blue-600">
                {[...Array(i.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
                ))}
              </div>
              <p className="text-base sm:text-xl font-black text-slate-900 italic leading-relaxed">"{i.text}"</p>
              <div className="space-y-1">
                <p className="font-black uppercase tracking-widest text-slate-900 text-xs sm:text-base">{i.name}</p>
                <p className="text-[8px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">{i.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </motion.div>
  );
};

export default Home;

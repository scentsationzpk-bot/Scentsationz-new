
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getStoreDataSync } from '../storage';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Shop: React.FC = () => {
  const initialProducts = getStoreDataSync().products;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(initialProducts.length === 0);

  const categories = ['All', 'Bold', 'Fresh', 'Warm', 'Woody', 'Oud'];

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      const top5 = p.slice(0, 5);
      setProducts(top5);
      setFilteredProducts(activeCategory === 'All' ? top5 : top5.filter(x => x.category === activeCategory));
      setLoading(false);
    };
    fetch();

    const handleUpdate = () => {
      fetch();
    };

    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Opening Vault...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-16 space-y-16"
    >
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 sm:gap-12 text-center lg:text-left">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 sm:space-y-6 w-full"
        >
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black text-slate-900 tracking-tighter leading-none uppercase">The <span className="text-blue-600 italic">Vault</span></h1>
          <p className="text-slate-500 text-[10px] sm:text-2xl font-black uppercase tracking-widest max-w-2xl mx-auto lg:mx-0">Handcrafted • High-Longevity • Elite</p>
        </motion.div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-xl sm:rounded-[2rem] border-2 sm:border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full lg:w-auto"
        >
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 sm:px-10 py-2.5 sm:py-4 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Performance Guarantee Banner */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-white"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full border-4 border-slate-900 flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-2xl sm:text-3xl">⏳</span>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">The Performance Guarantee</h3>
            <p className="text-slate-400 font-bold text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              We don't compromise. Every artifact is crafted at <span className="bg-blue-600/20 text-blue-400 px-1 rounded">40% Extrait de Parfum</span> concentration and macerated for 60 days. Expect 14+ hours of longevity and room-filling sillage. Blind buy with absolute confidence.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-16">
        {filteredProducts.map((product, index) => {
          const rating = (4.2 + (Math.abs(product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 78) / 100).toFixed(2);
          
          return (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              key={product.id}
            >
              <Link to={`/product/${product.id}`} className="group bg-white rounded-[2rem] sm:rounded-[3rem] border-4 border-slate-900 overflow-hidden hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-700 h-full flex flex-col shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] sm:shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] relative block">
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 bg-red-500 text-white text-[8px] sm:text-[10px] font-black px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border-2 border-slate-900 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] animate-pulse">
                    Only {product.stock} Left
                  </div>
                )}
                <div className="aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900">
                  <img 
                    src={product.imageUrl ? product.imageUrl.replace('w=800', 'w=400') : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=60&w=400'} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-contain p-6 sm:p-10 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  />
                </div>
                <div className="p-6 sm:p-10 space-y-3 sm:space-y-4 flex-grow text-center flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(Number(rating)) ? 'fill-blue-600 text-blue-600' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black text-slate-900">{rating}</span>
                  </div>
                  <span className="text-blue-600 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{product.category} Series</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2 sm:mt-4">
                    <p className="text-sm sm:text-base font-bold text-slate-400 line-through decoration-red-500 decoration-2">Rs. 7,200</p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</p>
                  </div>
                  <div className="w-full pt-4 sm:pt-6">
                     <div className="w-full py-3 sm:py-4 bg-slate-900 text-white font-black rounded-lg sm:rounded-xl uppercase tracking-widest text-[8px] sm:text-[10px] group-hover:bg-blue-600 transition-colors">Enter Vault</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Shop;

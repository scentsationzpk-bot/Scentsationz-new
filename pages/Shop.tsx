import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getStoreDataSync, addToCart } from '../storage';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ShoppingBag, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(getStoreDataSync().products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(getStoreDataSync().products);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(getStoreDataSync().products.length === 0);

  const fetchProducts = async () => {
    const p = await getProducts();
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    const handleUpdate = () => {
      const data = getStoreDataSync();
      setProducts(data.products);
    };

    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-900 font-black uppercase text-xs tracking-widest">Accessing Vault...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-12 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
        
        {/* Header Section */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate-900 rounded-xl bg-blue-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">The Registry • Active</span>
              </div>
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                THE <br />
                <span className="text-blue-600 italic">COLLECTION</span>
              </h1>
              <p className="text-slate-500 text-lg sm:text-xl font-bold max-w-xl leading-tight uppercase italic">
                "Explore our meticulously crafted extraits. Engineered for maximum longevity and absolute projection."
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl translate-x-1 translate-y-1 -z-10 group-focus-within:translate-x-2 group-focus-within:translate-y-2 transition-all"></div>
              <div className="relative flex items-center bg-white border-4 border-slate-900 rounded-2xl px-6 py-4">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search Vault..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full font-black uppercase text-sm tracking-widest placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Stats Card */}
          <div className="hidden lg:block bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 w-64">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <ShoppingBag className="w-3 h-3" /> Inventory Status
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter">{products.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Artifacts</p>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[85%]"></div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10"
              >
                {filteredProducts.map((product, index) => {
                  const rating = (4.2 + (Math.abs(product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 78) / 100).toFixed(2);
                  
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={product.id}
                    >
                      <Link 
                        to={`/product/${product.id}`} 
                        className="group block bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all overflow-hidden h-full flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="aspect-square bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900 overflow-hidden">
                          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                            {product.stock <= 5 && product.stock > 0 && (
                              <div className="bg-red-500 text-white px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-[10px] font-black uppercase tracking-widest">
                                Low Stock
                              </div>
                            )}
                            {product.badge && (
                              <div className="bg-blue-600 text-white px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-[10px] font-black uppercase tracking-widest">
                                {product.badge}
                              </div>
                            )}
                          </div>
                          
                          <img 
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'} 
                            alt={product.name} 
                            className="w-full h-full object-contain p-12 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                          />
                          
                          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-500"></div>
                        </div>

                          <div className="p-8 sm:p-10 flex flex-col flex-grow text-center items-center">
                            <div className="space-y-4 mb-8 flex-grow">
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(Number(rating)) ? 'fill-blue-600 text-blue-600' : 'text-slate-200'}`} />
                                  ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-900">{rating} / 5.0</span>
                              </div>
                              
                              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h3>
                              <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2">{product.description}</p>
                            </div>

                            <div className="w-full pt-8 border-t-4 border-slate-900 space-y-6">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-slate-400 line-through decoration-red-500 decoration-2">Rs. 12,000</span>
                                  <span className="text-2xl font-black text-slate-900 tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                </div>
                                <div className="mt-1 bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                  Save Rs. {(12000 - product.price).toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 w-full">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product/${product.id}`);
                                  }}
                                  className="flex items-center justify-center py-4 bg-white text-slate-900 font-black rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                >
                                  Details
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product, 1);
                                    navigate('/checkout');
                                  }}
                                  className="flex items-center justify-center py-4 bg-blue-600 text-white font-black rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest text-[10px] cursor-pointer"
                                >
                                  Quick Buy
                                </button>
                              </div>
                            </div>
                          </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 space-y-6"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-4 border-slate-100">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">No Artifacts Found</p>
                  <p className="text-slate-500 font-bold">Try adjusting your search or profile filters.</p>
                </div>
                <button 
                  onClick={() => { setSearchQuery(''); }}
                  className="px-8 py-4 bg-slate-900 text-white font-black rounded-xl uppercase tracking-widest text-xs"
                >
                  Reset Search
                </button>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;

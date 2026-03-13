import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../storage';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bold', 'Fresh', 'Warm', 'Woody', 'Oud'];

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      setProducts(p);
      setFilteredProducts(p);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 px-6 lg:px-12 font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">The Collection</h1>
          <p className="text-slate-500 text-lg">Explore our meticulously crafted extraits. Engineered for maximum longevity and projection.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Filter className="w-4 h-4" /> Filter by Profile
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={product.id}>
              <Link to={`/product/${product.id}`} className="group block h-full flex flex-col">
                <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                      Low Stock
                    </div>
                  )}
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{product.category}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-slate-900 font-semibold">Rs. {product.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm line-through">Rs. 7,200</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No fragrances found in this category.
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStoreDataSync } from '../storage';

const Header: React.FC = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const data = getStoreDataSync();
    const count = data.cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
    // Body scroll lock when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [location, mobileMenuOpen]);

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={`text-[12px] font-black uppercase tracking-[0.25em] transition-all px-6 py-2 rounded-full border-2 ${
        location.pathname === to 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
          : 'text-slate-500 border-transparent hover:text-blue-600 hover:bg-blue-50/50'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-3 translate-y-0' : 'py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4">
          <div className={`bg-white/90 backdrop-blur-xl border-4 border-slate-900 rounded-[2rem] px-6 py-4 flex justify-between items-center transition-all duration-500 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 group-hover:rotate-6 transition-transform">S</div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">SCENTSATIONZ</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/" label="Vault" />
              <NavLink to="/shop" label="Collection" />
              <NavLink to="/specs" label="Specs" />
              <NavLink to="/about" label="Identity" />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/cart" className="relative group p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 group-hover:text-blue-600 transition-colors">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-[9px] font-black text-white flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-[4px_4px_0px_0px_rgba(37,99,235,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16M4 6h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white border-l-8 border-slate-900 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-8 pt-20">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="space-y-4 mb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 block mb-4">Navigation Directory</span>
               {[
                 { to: '/', label: 'The Vault', icon: '🏛️' },
                 { to: '/shop', label: 'Full Collection', icon: '🛍️' },
                 { to: '/specs', label: 'Olfactory Specs', icon: '🧬' },
                 { to: '/about', label: 'Brand Identity', icon: '✨' },
                 { to: '/cart', label: 'Your Bag', icon: '👜', badge: cartCount }
               ].map((item) => (
                 <Link 
                   key={item.to}
                   to={item.to}
                   onClick={() => setMobileMenuOpen(false)}
                   className={`flex items-center justify-between p-6 rounded-2xl border-4 transition-all group ${
                     location.pathname === item.to 
                     ? 'bg-blue-600 border-slate-900 text-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] translate-x-1 -translate-y-1' 
                     : 'bg-white border-slate-100 text-slate-900 hover:border-blue-600'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">{item.icon}</span>
                     <span className="text-xl font-black uppercase tracking-tighter">{item.label}</span>
                   </div>
                   {item.badge !== undefined && item.badge > 0 && (
                     <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full">{item.badge}</span>
                   )}
                 </Link>
               ))}
            </div>

            <div className="mt-auto space-y-6">
               <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Need Support?</p>
                 <a href="tel:+923700162012" className="text-lg font-black text-slate-900 block hover:text-blue-600">+92 370 0162012</a>
                 <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1 italic">Online Assistance: Active</p>
               </div>
               
               <div className="flex items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl">📸</div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl">🐦</div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl">📘</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-28 lg:h-32"></div>
    </>
  );
};

export default Header;
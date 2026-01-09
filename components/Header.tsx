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
    setMobileMenuOpen(false);
  }, [location]);

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
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        isScrolled ? 'py-4 translate-y-0' : 'py-8'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className={`bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] px-10 py-5 flex justify-between items-center transition-all duration-500 ${
            isScrolled ? 'shadow-2xl shadow-blue-900/5' : 'shadow-none'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 group-hover:scale-110 group-hover:rotate-6 transition-transform">S</div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">SCENTSATIONZ</span>
            </Link>

            {/* Desktop Navigation - Increased spacing */}
            <nav className="hidden lg:flex items-center gap-12">
              <NavLink to="/" label="Vault" />
              <NavLink to="/shop" label="Collection" />
              <NavLink to="/specs" label="Specs" />
              <NavLink to="/about" label="Identity" />
            </nav>

            {/* Actions - Increased spacing */}
            <div className="flex items-center gap-8">
              <Link to="/cart" className="relative group p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 group-hover:text-blue-600 transition-colors">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-900 hover:text-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 12h16M4 6h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-6 mt-4 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-8 flex flex-col gap-4">
              <Link to="/" className="p-4 font-black text-2xl text-slate-900 hover:text-blue-600 transition-all uppercase tracking-tighter">Vault</Link>
              <Link to="/shop" className="p-4 font-black text-2xl text-slate-900 hover:text-blue-600 transition-all uppercase tracking-tighter">Collection</Link>
              <Link to="/specs" className="p-4 font-black text-2xl text-slate-900 hover:text-blue-600 transition-all uppercase tracking-tighter">Specs</Link>
              <Link to="/about" className="p-4 font-black text-2xl text-slate-900 hover:text-blue-600 transition-all uppercase tracking-tighter">Identity</Link>
            </div>
          </div>
        )}
      </header>
      {/* Spacer for fixed header */}
      <div className="h-32"></div>
    </>
  );
};

export default Header;
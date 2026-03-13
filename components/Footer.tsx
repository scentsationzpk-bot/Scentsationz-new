import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20 relative z-10 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                SCENT<span className="text-blue-500 italic">SATIONZ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
              Defining identity through olfactory precision. Premium molecular profiles for the modern legacy.
            </p>
            <div className="flex gap-4 pt-2">
               <a href="https://instagram.com/scentsationz.pk" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white text-xl hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer shadow-lg">📸</a>
               <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white text-xl hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer shadow-lg">🐦</div>
               <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white text-xl hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer shadow-lg">📘</div>
            </div>
          </div>

          {/* Directory Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Directory</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">The Collection</Link></li>
              <li><Link to="/about" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">Our Identity</Link></li>
              <li><Link to="/cart" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">Your Bag</Link></li>
              <li><Link to="/promotions" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">Promotions</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="tel:+923700162012" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">+92 370 0162012</a></li>
              <li><span className="block py-1 text-base font-bold text-slate-300">Karachi, Pakistan</span></li>
              <li><span className="block py-1 text-base font-bold text-blue-400 italic">Online Support: Active</span></li>
            </ul>
          </div>

          {/* Legal & Partners Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Legal & Partners</h4>
            <ul className="space-y-4">
              <li><Link to="/return-policy" className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors">Return & Refund Policy</Link></li>
              <li><span className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="block py-1 text-base font-bold text-slate-300 hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span></li>
              <li className="pt-4"><Link to="/promoter/login" className="block py-1 text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Promoter Portal</Link></li>
              <li><Link to="/admin-login" className="block py-1 text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Admin Access</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Scentsationz Artifacts.
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-right">
            Precision is our signature.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

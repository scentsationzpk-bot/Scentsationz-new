import React from "react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-8 border-slate-900 mt-20 relative z-10 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          <div className="space-y-6 text-center md:text-left">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                SCENTSATIONZ
              </span>
            </Link>
            <p className="text-sm sm:text-base text-slate-500 font-bold leading-relaxed max-w-xs mx-auto md:mx-0">
              Defining identity through olfactory precision. Premium molecular profiles for the modern legacy. 🏛️✨
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               <a href="https://instagram.com/scentsationz.pk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl hover:rotate-6 transition-transform cursor-pointer">📸</a>
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl hover:-rotate-6 transition-transform cursor-pointer">🐦</div>
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl hover:rotate-6 transition-transform cursor-pointer">📘</div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6 sm:mb-8">Directory</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">The Vault</Link></li>
              <li><Link to="/shop" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">Collection</Link></li>
              <li><Link to="/about" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">Identity</Link></li>
              <li><Link to="/cart" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">Your Bag</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6 sm:mb-8">Support</h4>
            <ul className="space-y-4">
              <li><a href="tel:+923700162012" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">+92 370 0162012</a></li>
              <li><span className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tighter">Karachi, Pakistan</span></li>
              <li><span className="text-base sm:text-lg font-black text-green-600 uppercase tracking-tighter italic">Online Support: Active</span></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6 sm:mb-8">Partners</h4>
            <ul className="space-y-4">
              <li><Link to="/promoter/login" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">Promoter Portal 💸</Link></li>
              <li><Link to="/admin-login" className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-tighter">Admin Access 🔐</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t-4 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em] text-center md:text-left">
            &copy; 2026 Scentsationz Artifacts. Precision is our signature.
          </p>
          <div className="flex gap-4 sm:gap-8">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Privacy Policy</span>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

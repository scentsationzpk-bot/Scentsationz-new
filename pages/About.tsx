
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 md:space-y-60 animate-in fade-in duration-700">
      <div className="text-center space-y-6 sm:space-y-8">
        <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black text-slate-900 tracking-tighter leading-none">Luxury Redefined 💫</h1>
        <p className="text-xl sm:text-2xl md:text-5xl text-slate-500 max-w-4xl mx-auto font-bold leading-relaxed">
          Crafting premium scents that define your identity. We believe a fragrance is the most intimate form of self-expression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-32 items-center">
        <div className="space-y-6 sm:space-y-8 md:space-y-12 p-8 sm:p-10 md:p-24 bg-white rounded-3xl sm:rounded-[4rem] md:rounded-[6rem] border-4 md:border-8 border-slate-50 shadow-2xl relative">
          <div className="absolute -top-6 -left-6 sm:-top-10 -left-10 w-16 h-16 sm:w-24 sm:h-24 bg-blue-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white text-2xl sm:text-4xl shadow-xl">✨</div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-blue-600 tracking-tighter leading-[0.8]">Our Essence</h2>
          <div className="space-y-4 sm:space-y-6 md:space-y-10 text-slate-600 font-medium text-base sm:text-lg md:text-3xl leading-relaxed">
            <p>
              Scentsationz was born out of a passion for luxury and the belief that the finest fragrances should be accessible to all.
            </p>
            <p>
              Today, we are proud to offer a collection that speaks to diverse styles. Every bottle is a testament to our commitment to quality.
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6">
             <div className="h-2 sm:h-3 w-16 sm:w-24 bg-blue-600 rounded-full"></div>
             <div className="h-2 sm:h-3 w-8 sm:w-12 bg-blue-100 rounded-full"></div>
             <div className="h-2 sm:h-3 w-4 sm:w-6 bg-blue-50 rounded-full"></div>
          </div>
        </div>
        <div className="aspect-square bg-slate-50 rounded-3xl sm:rounded-[4rem] md:rounded-[6rem] flex items-center justify-center p-10 sm:p-20 relative overflow-hidden group shadow-inner border-4 border-slate-100">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-[2s] sm:w-[200px] sm:h-[200px] md:w-[400px] md:h-[400px]">
            <path d="M12 2L15 8l6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/>
          </svg>
          <span className="absolute top-8 left-8 sm:top-12 sm:left-12 text-4xl sm:text-6xl md:text-9xl opacity-20">🌿</span>
          <span className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-4xl sm:text-6xl md:text-9xl opacity-20">🔱</span>
        </div>
      </div>

      {/* Our Values Section (New) */}
      <section className="space-y-12 sm:space-y-20">
         <div className="text-center space-y-4 sm:space-y-6">
            <span className="text-blue-600 font-black text-xs sm:text-sm uppercase tracking-[0.5em] block">Foundational Pillars</span>
            <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-slate-900 tracking-tighter">Our Core Values 💎</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="bg-white p-8 sm:p-12 md:p-20 rounded-3xl sm:rounded-[4rem] border-4 border-slate-50 shadow-xl space-y-6 sm:space-y-8 hover:border-blue-600 transition-all">
               <div className="text-4xl sm:text-6xl">💎</div>
               <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight">Authenticity</h3>
               <p className="text-slate-500 text-base sm:text-lg md:text-2xl leading-relaxed">No imitations. No compromises. We create original luxury profiles for individual legacies.</p>
            </div>
            <div className="bg-white p-8 sm:p-12 md:p-20 rounded-3xl sm:rounded-[4rem] border-4 border-slate-50 shadow-xl space-y-6 sm:space-y-8 hover:border-blue-600 transition-all">
               <div className="text-4xl sm:text-6xl">🔬</div>
               <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight">Innovation</h3>
               <p className="text-slate-500 text-base sm:text-lg md:text-2xl leading-relaxed">Leveraging global fragrance technology to deliver extreme longevity.</p>
            </div>
            <div className="bg-white p-8 sm:p-12 md:p-20 rounded-3xl sm:rounded-[4rem] border-4 border-slate-50 shadow-xl space-y-6 sm:space-y-8 hover:border-blue-600 transition-all">
               <div className="text-4xl sm:text-6xl">🤝</div>
               <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight">Loyalty</h3>
               <p className="text-slate-500 text-base sm:text-lg md:text-2xl leading-relaxed">We treat every customer as an elite member of our olfactory community.</p>
            </div>
         </div>
      </section>

      {/* Promise Section */}
      <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[4rem] md:rounded-[10rem] p-10 sm:p-16 md:p-48 text-center text-white space-y-12 sm:space-y-16 md:space-y-32 relative overflow-hidden shadow-2xl border-4 border-white/5">
        <div className="absolute top-0 right-0 p-24 md:p-48 opacity-5">
           <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[600px] sm:h-[600px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        </div>
        <div className="relative z-10 space-y-8 sm:space-y-12 md:space-y-24">
          <h2 className="text-3xl sm:text-5xl md:text-[10rem] font-black tracking-tighter leading-[0.8]">The Scentsationz <br /><span className="text-blue-400 italic">Promise</span> 🛡️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 md:gap-24">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-4xl sm:text-6xl md:text-8xl block mb-2 sm:mb-4">🧪</span>
              <h3 className="text-xl sm:text-2xl md:text-5xl font-black tracking-tight">Pure Oils Only</h3>
              <p className="text-slate-400 font-medium text-base sm:text-lg md:text-2xl">Only the purest essential oils for 14hr+ longevity on skin.</p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <span className="text-4xl sm:text-6xl md:text-8xl block mb-2 sm:mb-4">🌡️</span>
              <h3 className="text-xl sm:text-2xl md:text-5xl font-black tracking-tight">Climate Optimized</h3>
              <p className="text-slate-400 font-medium text-base sm:text-lg md:text-2xl">Meticulously analyzed for peak performance in any environment.</p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <span className="text-4xl sm:text-6xl md:text-8xl block mb-2 sm:mb-4">✨</span>
              <h3 className="text-xl sm:text-2xl md:text-5xl font-black tracking-tight">Global Luxe</h3>
              <p className="text-slate-400 font-medium text-base sm:text-lg md:text-2xl">Designed for the modern lifestyle with global standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

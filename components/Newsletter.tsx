import React, { useState } from 'react';
import { captureEmail } from '../storage';
import { useToast } from '../App';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const success = await captureEmail(email, 'footer_newsletter');
    setLoading(false);

    if (success) {
      showToast('Welcome to the Registry! 💎', 'success');
      setEmail('');
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-slate-900 p-8 md:p-12 rounded-[2rem] border-4 border-blue-600 shadow-[20px_20px_0px_0px_rgba(37,99,235,0.2)]">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em]">The Inner Circle</span>
        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Join The <span className="text-blue-400">Registry</span></h3>
        <p className="text-slate-400 font-medium">Get exclusive access to private drops, molecular analysis reports, and elite promotions.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 pt-4">
          <input
            type="email"
            placeholder="Enter your elite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? 'Syncing...' : 'Access Now'}
          </button>
        </form>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Privacy is our signature. No spam, ever.</p>
      </div>
    </div>
  );
};

export default Newsletter;

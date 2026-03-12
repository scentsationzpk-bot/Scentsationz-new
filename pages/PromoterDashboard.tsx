import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getPromoter, getWithdrawalRequests, requestWithdrawal, getProducts } from '../storage';
import { Promoter, WithdrawalRequest, Product } from '../types';
import { useToast } from '../App';

const PromoterDashboard: React.FC = () => {
  const [promoter, setPromoter] = useState<Promoter | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const [p, w, prods] = await Promise.all([
            getPromoter(user.uid),
            getWithdrawalRequests(user.uid),
            getProducts()
          ]);
          if (p) {
            setPromoter(p);
            setWithdrawals(w);
            setProducts(prods);
          } else {
            showToast('Promoter account not found.', 'error');
            navigate('/');
          }
        } catch (error) {
          showToast('Failed to sync data.', 'error');
        }
      } else {
        navigate('/promoter/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, showToast]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoter) return;

    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount < 500) {
      showToast('Minimum withdrawal is Rs. 500.', 'error');
      return;
    }

    if (amount > promoter.currentBalance) {
      showToast('Insufficient balance.', 'error');
      return;
    }

    try {
      await requestWithdrawal(promoter.id, amount, withdrawMethod, accountName, accountNumber);
      showToast('Withdrawal request submitted! 💸', 'success');
      setShowWithdrawModal(false);
      
      // Refresh data
      const p = await getPromoter(promoter.id);
      if (p) setPromoter(p);
      const w = await getWithdrawalRequests(promoter.id);
      setWithdrawals(w);
    } catch (error: any) {
      showToast(error.message || 'Failed to submit request.', 'error');
    }
  };

  const downloadProductImage = (product: Product) => {
    if (!product.imageUrl) return;
    const link = document.createElement('a');
    link.href = product.imageUrl;
    link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = "_blank";
    link.click();
    showToast(`Downloading image for ${product.name}...`, 'success');
  };

  const handleCopyCode = () => {
    if (!promoter) return;
    navigator.clipboard.writeText(promoter.referralCode);
    showToast('Referral code copied! 📋', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!promoter) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
            Promoter <span className="text-blue-600 italic">Dashboard</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold">Welcome back, {promoter.name}! 🚀</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-black rounded-2xl border-4 border-slate-900 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Earnings</p>
          <p className="text-4xl font-black text-blue-600">Rs. {promoter.totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Current Balance</p>
          <p className="text-4xl font-black text-green-600">Rs. {promoter.currentBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Pending Balance</p>
          <p className="text-4xl font-black text-orange-600">Rs. {promoter.pendingBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Orders</p>
          <p className="text-4xl font-black text-slate-900">{promoter.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Code & AI Generator */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] md:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4 md:mb-6">Your Referral Code</h2>
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border-4 border-slate-200 mb-4 md:mb-6 text-center relative group">
              <p className="font-black text-blue-600 text-3xl md:text-5xl tracking-widest">{promoter.referralCode}</p>
              <button 
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-2 bg-white border-2 border-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                title="Copy Code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
            <button 
              onClick={handleCopyCode}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl border-4 border-slate-900 uppercase tracking-widest hover:bg-slate-800 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-x-1 active:translate-y-1 active:shadow-none md:hidden mb-4"
            >
              Copy Code 📋
            </button>
            <p className="text-[11px] md:text-sm font-bold text-slate-500 text-center">
              Buyers can enter this code at checkout to support you.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] md:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4 md:mb-6">Withdraw Funds</h2>
            <p className="text-slate-500 font-bold text-[11px] md:text-sm mb-6">Minimum withdrawal amount is Rs. 500. Payments are processed via Easypaisa or JazzCash.</p>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              disabled={promoter.currentBalance < 500}
              className="w-full py-5 bg-green-500 text-white font-black rounded-2xl border-4 border-slate-900 uppercase tracking-widest hover:bg-green-600 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              Request Payout 💸
            </button>
          </div>
        </div>

        {/* Right Column: Marketing Assets & History */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Marketing Assets */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] md:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900">Marketing Assets</h2>
              <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">HQ Images</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <div key={product.id} className="group relative">
                  <div className="aspect-square rounded-2xl border-4 border-slate-100 overflow-hidden bg-slate-50">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="mt-3">
                    <p className="font-black text-slate-900 text-[10px] md:text-xs truncate uppercase">{product.name}</p>
                    <button 
                      onClick={() => downloadProductImage(product)}
                      className="mt-2 w-full py-3 bg-slate-100 text-slate-600 font-black rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-slate-900"
                    >
                      Download 📥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] md:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 mb-6 md:mb-8">Payout History</h2>
            
            {withdrawals.length === 0 ? (
              <div className="text-center py-8 md:py-12 bg-slate-50 rounded-2xl border-4 border-slate-100">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No payouts yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map(w => (
                  <div key={w.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 bg-slate-50 rounded-[1.5rem] border-4 border-slate-100 gap-4">
                    <div>
                      <p className="font-black text-slate-900 text-base md:text-lg">Rs. {w.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{w.method} • {new Date(w.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border-2 ${
                      w.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                      w.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {w.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col animate-in zoom-in duration-300 border-4 border-slate-900 p-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-6">Request Payout</h2>
            
            <form onSubmit={handleWithdrawRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-900">Amount (Rs.)</label>
                <input 
                  type="number" 
                  required
                  min="500"
                  max={promoter.currentBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
                  placeholder="500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-900">Method</label>
                <select 
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="JazzCash">JazzCash</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-900">Account Title</label>
                <input 
                  type="text" 
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-900">Account Number</label>
                <input 
                  type="text" 
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
                  placeholder="03XX XXXXXXX"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-900 font-black rounded-xl border-4 border-slate-900 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-xl border-4 border-slate-900 uppercase tracking-widest hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoterDashboard;

import React, { useState, useEffect } from 'react';
import { getAllPromoters } from '../storage';
import { Promoter } from '../types';
import { useToast } from '../App';

const AdminPromoters: React.FC = () => {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPromoters = async () => {
      try {
        const data = await getAllPromoters();
        setPromoters(data);
      } catch (error: any) {
        showToast(error.message || 'Failed to fetch promoters.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromoters();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Promoters...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Promoters</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Manage active promoters and their performance.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-4 border-slate-900">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Promoter</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Referral Code</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Clicks</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Orders</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Total Earned</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Balance</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {promoters.map((promoter) => (
              <tr key={promoter.id} className="border-b-4 border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-black text-slate-900">{promoter.name}</p>
                  <p className="text-xs text-slate-500 font-bold">{promoter.email}</p>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 font-black text-xs rounded-lg border-2 border-slate-200">
                    {promoter.referralCode}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-600">{promoter.totalReferrals}</td>
                <td className="p-4 font-bold text-slate-600">{promoter.totalOrders}</td>
                <td className="p-4 font-black text-green-600">Rs. {promoter.totalEarned.toLocaleString()}</td>
                <td className="p-4 font-black text-blue-600">Rs. {promoter.currentBalance.toLocaleString()}</td>
                <td className="p-4 font-bold text-slate-500 text-sm">{new Date(promoter.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {promoters.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">No promoters found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPromoters;

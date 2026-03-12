import React, { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalStatus, getAllPromoters } from '../storage';
import { WithdrawalRequest, Promoter } from '../types';
import { useToast } from '../App';
import { Link } from 'react-router-dom';

const AdminPayouts: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [promoters, setPromoters] = useState<Record<string, Promoter>>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [reqs, proms] = await Promise.all([
        getWithdrawalRequests(),
        getAllPromoters()
      ]);
      
      setRequests(reqs);
      
      const promoterMap: Record<string, Promoter> = {};
      proms.forEach(p => {
        promoterMap[p.id] = p;
      });
      setPromoters(promoterMap);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected', promoterId: string, amount: number) => {
    try {
      await updateWithdrawalStatus(id, status, promoterId, amount);
      showToast(`Payout ${status}!`, 'success');
      
      // Refresh
      const reqs = await getWithdrawalRequests();
      setRequests(reqs);
    } catch (error: any) {
      showToast(error.message || 'Failed to update status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Syncing Payouts...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Admin Payouts</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Manage promoter withdrawal requests.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-4 border-slate-900">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Promoter</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Amount</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Method</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Details</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const promoter = promoters[req.promoterId];
              return (
                <tr key={req.id} className="border-b-4 border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-600 text-sm">{new Date(req.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="font-black text-slate-900">{promoter?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 font-bold">{promoter?.email}</p>
                  </td>
                  <td className="p-4 font-black text-blue-600">Rs. {req.amount.toLocaleString()}</td>
                  <td className="p-4 font-bold text-slate-900">{req.method}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm">{req.accountName}</p>
                    <p className="text-xs text-slate-500 font-bold">{req.accountNumber}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest border-2 ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'Pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'Approved', req.promoterId, req.amount)}
                          className="px-4 py-2 bg-green-500 text-white font-black rounded-lg border-2 border-green-700 uppercase tracking-widest text-[10px] hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'Rejected', req.promoterId, req.amount)}
                          className="px-4 py-2 bg-red-500 text-white font-black rounded-lg border-2 border-red-700 uppercase tracking-widest text-[10px] hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">No payout requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayouts;

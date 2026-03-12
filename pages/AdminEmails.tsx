import React, { useState, useEffect } from 'react';
import { getCapturedEmails } from '../storage';

const AdminEmails: React.FC = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCapturedEmails();
      setEmails(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-4 inline-block">Database: CAPTURED_EMAILS</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">The <span className="text-blue-600">Registry</span> List</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Captured elite emails for marketing and outreach.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{emails.length} Elite Members</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Captured At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Decrypting Registry...</td>
                </tr>
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No elite members found.</td>
                </tr>
              ) : (
                emails.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-900 text-lg tracking-tight">{item.email}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-400">
                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : 'Just now'}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEmails;

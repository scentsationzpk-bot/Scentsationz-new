import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../App';

const AdminSettings: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'referral');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCommissionRate(docSnap.data().commissionRate || 15);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'referral'), {
        commissionRate: Number(commissionRate)
      }, { merge: true });
      showToast('Settings saved successfully! 🎉', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Configure global application settings.</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-[4px] border-slate-50 shadow-sm max-w-2xl">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Referral Program</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Commission Rate (%)</label>
            <div className="relative">
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={commissionRate} 
                onChange={e => setCommissionRate(Number(e.target.value))} 
                className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all font-black text-xl outline-none shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)] focus:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" 
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">%</span>
            </div>
            <p className="text-xs font-bold text-slate-500 ml-4">The percentage of the order total given to promoters.</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

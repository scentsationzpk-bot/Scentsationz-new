import React, { useState, useEffect } from 'react';
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from '../storage';
import { Promotion } from '../types';
import { useToast } from '../App';

const AdminPromotions: React.FC = () => {
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountPercentage: 0,
    validUntil: '',
    isActive: true,
    colorClass: 'bg-blue-600'
  });

  useEffect(() => {
    refreshPromotions();
  }, []);

  const refreshPromotions = async () => {
    setLoading(true);
    try {
      const cloudPromotions = await getPromotions();
      setPromotions(cloudPromotions);
    } catch (e) {
      showToast('Cloud sync failed ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPromotion(null);
    setFormData({ title: '', description: '', code: '', discountPercentage: 10, validUntil: '', isActive: true, colorClass: 'bg-blue-600' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Promotion) => {
    setEditingPromotion(p);
    setFormData({
      title: p.title,
      description: p.description,
      code: p.code,
      discountPercentage: p.discountPercentage,
      validUntil: p.validUntil,
      isActive: p.isActive,
      colorClass: p.colorClass
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, formData);
        showToast('Promotion Updated 🔄', 'success');
      } else {
        await addPromotion(formData);
        showToast('Promotion Added 🛍️', 'success');
      }
      setIsModalOpen(false);
      refreshPromotions();
    } catch (error: any) {
      showToast('Sync Error ❌', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Erase this promotion?')) {
      try {
        await deletePromotion(id);
        showToast('Promotion Deleted 🗑️', 'success');
        refreshPromotions();
      } catch (e) {
        showToast('Erasure failed ❌', 'error');
      }
    }
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Syncing Promotions...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Promotions</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Manage active offers and discounts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95 text-xl uppercase tracking-tighter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promotions.map((p) => (
          <div key={p.id} className="bg-white rounded-[3rem] border-[4px] border-slate-50 overflow-hidden hover:border-blue-600 transition-all duration-700 group flex flex-col shadow-sm">
            <div className={`p-8 ${p.colorClass} text-white flex flex-col items-center text-center space-y-4`}>
              <h3 className="text-3xl font-black tracking-tighter uppercase">{p.title}</h3>
              <p className="font-bold opacity-90">{p.description}</p>
              <div className="bg-white/20 px-6 py-2 rounded-xl border-2 border-white/30 backdrop-blur-sm">
                <span className="font-black tracking-widest uppercase">{p.code}</span>
              </div>
              <div className="text-5xl font-black tracking-tighter pt-4">
                {p.discountPercentage}% OFF
              </div>
            </div>
            
            <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b-2 border-slate-50 pb-4">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Status</span>
                  <span className={`font-black uppercase text-xs tracking-widest px-3 py-1 rounded-lg ${p.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-slate-50 pb-4">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Valid Until</span>
                  <span className="font-black text-slate-900">{p.validUntil || 'Forever'}</span>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleOpenEdit(p)}
                  className="flex-1 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-colors uppercase tracking-widest text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase tracking-widest">No Promotions Found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border-[6px] border-slate-900 my-8">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{editingPromotion ? 'Edit Promotion' : 'New Promotion'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors"
                      placeholder="e.g. Summer Sale"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Promo Code</label>
                    <input 
                      required
                      type="text" 
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value})}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors uppercase"
                      placeholder="e.g. SUMMER20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors min-h-[120px]"
                    placeholder="Short description of the offer..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Discount Percentage (%)</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={e => setFormData({...formData, discountPercentage: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Valid Until (Optional)</label>
                    <input 
                      type="date" 
                      value={formData.validUntil}
                      onChange={e => setFormData({...formData, validUntil: e.target.value})}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Color Theme</label>
                    <select 
                      value={formData.colorClass}
                      onChange={e => setFormData({...formData, colorClass: e.target.value})}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors appearance-none"
                    >
                      <option value="bg-blue-600">Blue</option>
                      <option value="bg-slate-900">Dark</option>
                      <option value="bg-emerald-600">Emerald</option>
                      <option value="bg-purple-600">Purple</option>
                      <option value="bg-rose-600">Rose</option>
                      <option value="bg-amber-600">Amber</option>
                    </select>
                  </div>
                  <div className="space-y-3 flex flex-col justify-center">
                    <label className="flex items-center gap-4 cursor-pointer pt-6">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        className="w-8 h-8 rounded-xl border-4 border-slate-200 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-black text-slate-900 uppercase tracking-widest">Active Promotion</span>
                    </label>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-colors uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Promotion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;

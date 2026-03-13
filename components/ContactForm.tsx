import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate form submission
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-32">
      <div className="bg-white p-6 sm:p-12 md:p-20 rounded-2xl sm:rounded-[3rem] border-2 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:shadow-[15px_15px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6 sm:mb-10 text-center sm:text-left">Get In Touch</h2>
        {status === 'success' ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-xl sm:text-2xl font-black text-blue-600 uppercase tracking-widest">Message Received</p>
            <p className="text-slate-500 mt-4 font-bold">We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            <input type="text" placeholder="Name" required className="w-full p-4 sm:p-6 border-2 sm:border-4 border-slate-900 rounded-xl font-bold text-sm sm:text-lg focus:border-blue-600 outline-none transition-colors" />
            <input type="email" placeholder="Email" required className="w-full p-4 sm:p-6 border-2 sm:border-4 border-slate-900 rounded-xl font-bold text-sm sm:text-lg focus:border-blue-600 outline-none transition-colors" />
            <textarea placeholder="Message" required className="w-full p-4 sm:p-6 border-2 sm:border-4 border-slate-900 rounded-xl font-bold text-sm sm:text-lg h-32 sm:h-40 focus:border-blue-600 outline-none transition-colors"></textarea>
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full py-4 sm:py-8 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl text-lg sm:text-2xl hover:bg-blue-600 transition-all uppercase tracking-tighter active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] sm:shadow-none"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm;

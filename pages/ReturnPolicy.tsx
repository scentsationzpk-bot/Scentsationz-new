import React from 'react';
import { motion } from 'framer-motion';

const ReturnPolicy: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white pt-24 pb-16 selection:bg-blue-900 selection:text-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Return & Refund <span className="text-blue-600 italic">Policy</span>
            </h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs sm:text-sm">
              Strictly Enforced Standards
            </p>
          </div>

          <div className="bg-slate-50 border-4 border-slate-900 rounded-[2rem] p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. General Policy</h2>
              <p className="text-slate-600 font-bold leading-relaxed">
                At Scentsationz, we maintain the highest standards of quality control and hygiene. Due to the nature of our products (premium extrait de parfums), <span className="text-slate-900 font-black bg-blue-100 px-1">we do not offer returns, exchanges, or refunds under any normal circumstances.</span> All sales are final once an order has been processed and shipped.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Defective or Damaged Items</h2>
              <p className="text-slate-600 font-bold leading-relaxed">
                The only exception to our strict no-return policy is if you receive a defective or damaged product. If your item arrives broken, leaking, or with a malfunctioning atomizer, you are eligible for a replacement or refund.
              </p>
              <ul className="list-disc list-inside text-slate-600 font-bold leading-relaxed space-y-2 ml-4">
                <li>You must notify us within <span className="text-slate-900 font-black">48 hours</span> of receiving the package.</li>
                <li>You must provide clear photographic or video evidence of the defect or damage.</li>
                <li>The product must be unused and in its original packaging.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Claim Process</h2>
              <p className="text-slate-600 font-bold leading-relaxed">
                To initiate a claim for a defective item, please contact our support team immediately via WhatsApp or email. Once we verify the defect, we will arrange for a replacement to be sent to you at no additional cost, or issue a refund if a replacement is unavailable.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Blind Buys</h2>
              <p className="text-slate-600 font-bold leading-relaxed">
                We do not accept returns or offer refunds if you simply do not like the scent. Fragrance is subjective, and while we engineer our profiles to be universally appealing, we cannot guarantee personal preference. We encourage reviewing the scent notes carefully before purchasing.
              </p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReturnPolicy;

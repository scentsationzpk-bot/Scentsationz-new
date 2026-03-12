import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../App';

const PromoterLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back, Promoter! 🎉', 'success');
      navigate('/promoter/dashboard');
    } catch (error: any) {
      showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast('Please enter your email address first.', 'error');
      return;
    }
    setResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset email.', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Promoter Login</h1>
          <p className="text-slate-500 font-bold mt-2">Access your earnings dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-900">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-900">Password</label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={resetting}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {resetting ? 'Sending...' : 'Forgot Password?'}
              </button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-4 border-slate-900 font-bold outline-none focus:border-blue-600"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-xl border-4 border-slate-900 uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 font-bold text-sm">
            Don't have an account? <Link to="/promoter/signup" className="text-blue-600 hover:underline">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoterLogin;

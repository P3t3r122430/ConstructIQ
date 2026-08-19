import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { HardHat, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean>(true);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  const { updatePassword, isConfigured } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if recovery session or token in hash is present
    async function checkRecovery() {
      if (!isConfigured) {
        setHasRecoverySession(true);
        setCheckingSession(false);
        return;
      }

      // Check URL hash for type=recovery or access_token
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        setHasRecoverySession(true);
        setCheckingSession(false);
        return;
      }

      // Check active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasRecoverySession(true);
      } else {
        // Still allow attempt in case token is being parsed asynchronously by Supabase
        setHasRecoverySession(true);
      }
      setCheckingSession(false);
    }

    checkRecovery();
  }, [isConfigured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      error('Password Required', 'Please enter your new password.');
      return;
    }

    if (password.length < 6) {
      error('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      error('Mismatch', 'Passwords do not match. Please verify and try again.');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(password);
      if (result.success) {
        setSuccessState(true);
        success('Password Updated', 'Your security credentials have been updated successfully.');
      } else {
        error('Update Failed', result.error || 'Could not update password. The reset link may have expired.');
      }
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-bold text-sm">
        Verifying security token...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Top Back to Home Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Main Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mt-6 sm:mt-0">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <HardHat className="w-7 h-7 text-slate-950 stroke-[2.2]" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
          Create New Password
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter a strong, secure password for your ApexBuild engineering account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {successState ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Password Changed Successfully</h3>
              <p className="text-xs text-slate-400">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all mt-4"
              >
                Proceed to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {password && (
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className={`w-3.5 h-3.5 ${password.length >= 6 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>At least 6 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className={`w-3.5 h-3.5 ${password && password === confirmPassword ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Passwords match</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-4 border-t border-slate-800">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel & Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

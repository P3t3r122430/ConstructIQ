import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  CheckCircle2, 
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { profile, user, updateProfile, updatePassword, refreshProfile } = useAuth();
  const { success, error } = useToast();

  // Profile fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Security password fields
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.company_name || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setPhone(user.user_metadata?.phone || '');
      setCompanyName(user.user_metadata?.company_name || '');
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      error('Name Required', 'Please provide your full name.');
      return;
    }

    setSavingProfile(true);
    try {
      const ok = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        company_name: companyName.trim() || null
      });

      if (ok) {
        success('Profile Updated', 'Your contact and organization details have been saved.');
        await refreshProfile();
      } else {
        error('Update Failed', 'Could not save profile changes.');
      }
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      error('Password Required', 'Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      error('Too Short', 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      error('Mismatch', 'Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.success) {
        success('Password Changed', 'Your security password has been updated.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        error('Update Failed', res.error || 'Could not update password.');
      }
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Client Account & Security</h1>
        <p className="text-xs text-slate-400">
          Manage your organizational contact details, tender notices, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Overview Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black text-xl flex items-center justify-center">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate">
                  {profile?.full_name || 'Client Account'}
                </h3>
                <p className="text-xs text-slate-400 truncate">{profile?.email || user?.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 mt-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-full uppercase">
                  Verified Client
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Account Email
                </span>
                <span className="text-white font-mono truncate max-w-[150px]">{profile?.email || user?.email}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> Organization
                </span>
                <span className="text-white font-semibold">{profile?.company_name || 'Individual'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Member Since
                </span>
                <span className="text-white">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '2026'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Role & Status
                </span>
                <span className="text-emerald-400 font-bold">Active Customer</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Confidentiality & Privacy
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your drawings, bills of quantities, and quotation submissions are encrypted and isolated via PostgreSQL Row Level Security (RLS). Only assigned ApexBuild estimators have review clearance.
            </p>
          </div>
        </div>

        {/* Right Columns: Edit Profile & Password Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Organization & Contact Info</h3>
                <p className="text-xs text-slate-400">Update official contact details used on formal contracts</p>
              </div>
              <User className="w-5 h-5 text-amber-500" />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Authorized Representative Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Direct Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Organization / Developer
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Skyline Ventures Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Email Address (Read-Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Security & Password</h3>
                <p className="text-xs text-slate-400">Update your access password for this portal account</p>
              </div>
              <KeyRound className="w-5 h-5 text-amber-500" />
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
                      placeholder="Re-enter password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {newPassword && (
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${newPassword.length >= 6 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Minimum 6 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Passwords match</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../context/ToastContext';
import { Profile, UserRole } from '../../types/database';
import { Users, Search, Shield, Building, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchProfiles = async () => {
    setLoading(true);
    const list = await dataService.getProfiles();
    setProfiles(list);
    setFilteredProfiles(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setFilteredProfiles(
        profiles.filter(
          p =>
            p.full_name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            (p.company_name && p.company_name.toLowerCase().includes(q))
        )
      );
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await dataService.updateProfileRole(userId, newRole);
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
      success('Role Updated', `User permissions changed to ${newRole.toUpperCase()}`);
    } catch (err: unknown) {
      error('Failed to change role', err instanceof Error ? err.message : 'Error');
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
            Identity & Access Control (RBAC)
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Executive Admin Only
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Client Accounts & Role Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage registered clients, assign site managers, and configure institutional access permissions.
        </p>
      </div>

      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading accounts...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">No accounts registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Organization / Developer</th>
                  <th className="px-6 py-4">Direct Contact</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Assigned Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredProfiles.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {u.company_name || 'Individual Developer'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {u.phone || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          u.role === 'admin'
                            ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                            : u.role === 'manager' || u.role === 'project_manager'
                            ? 'bg-blue-950/80 border-blue-800 text-blue-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <option value="customer">Client (Customer)</option>
                        <option value="manager">Site Operations Manager</option>
                        <option value="project_manager">Project Manager / Engineer</option>
                        <option value="admin">Executive Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

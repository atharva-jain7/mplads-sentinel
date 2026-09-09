import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Building, UserCheck, Landmark, MapPin } from 'lucide-react';
import { authService } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  // 4 Preconfigured Stakeholder Roles
  const roles = [
    {
      id: 'MP',
      name: 'Member of Parliament',
      short: 'MP (Pune PC)',
      icon: UserCheck,
      username: 'mp.pune@sansad.nic.in',
      fullName: "Hon'ble MP (Pune Constituency)",
      role: 'MEMBER_OF_PARLIAMENT',
      designation: 'Member of Parliament, Lok Sabha',
      jurisdiction: 'Pune Parliamentary Constituency',
      district: 'Pune',
      state: 'Maharashtra',
      description: 'Constituency works recommended by MP, quota utilization & asset creation progress'
    },
    {
      id: 'DISTRICT',
      name: 'District Authority',
      short: 'District Collector',
      icon: MapPin,
      username: 'officer@nic.in',
      fullName: 'Rajesh Sharma, IAS',
      role: 'DISTRICT_MONITORING_OFFICER',
      designation: 'District Magistrate / Nodal Officer',
      jurisdiction: 'Pune District Administration',
      district: 'Pune',
      state: 'Maharashtra',
      description: 'Field execution monitoring, contractor scrutiny & inspection queue'
    },
    {
      id: 'STATE',
      name: 'State Nodal Authority',
      short: 'State Planning',
      icon: Building,
      username: 'state.nodal@maharashtra.gov.in',
      fullName: 'Sunita Patil, IAS',
      role: 'STATE_NODAL_AUTHORITY',
      designation: 'Secretary, Planning Dept',
      jurisdiction: 'Maharashtra State Authority',
      district: 'State Level',
      state: 'Maharashtra',
      description: 'Inter-district monitoring, state fund flow & bottleneck resolution'
    },
    {
      id: 'MINISTRY',
      name: 'The Ministry (MoSPI)',
      short: 'Central MoSPI',
      icon: Landmark,
      username: 'ministry@nic.in',
      fullName: 'Dr. Alok Verma, IAS',
      role: 'CENTRAL_MINISTRY',
      designation: 'Joint Secretary, MoSPI',
      jurisdiction: 'National Central Oversight',
      district: 'All India',
      state: 'National',
      description: 'All-India scheme implementation, national anomaly radar & policy compliance'
    }
  ];

  const [selectedRole, setSelectedRole] = useState(roles[0]); // Default to MP
  const [username, setUsername] = useState(roles[0].username);
  const [password, setPassword] = useState('Sentinel@2026');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (r) => {
    setSelectedRole(r);
    setUsername(r.username);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      token: `token-${selectedRole.id.toLowerCase()}-2026`,
      username: username,
      fullName: selectedRole.fullName,
      role: selectedRole.role,
      roleId: selectedRole.id,
      designation: selectedRole.designation,
      jurisdiction: selectedRole.jurisdiction,
      district: selectedRole.district,
      state: selectedRole.state
    };

    authService.login(userData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">भारत सरकार</span>
          <span>•</span>
          <span className="font-semibold text-slate-300">GOVERNMENT OF INDIA</span>
          <span>•</span>
          <span className="text-slate-400 hidden sm:inline">Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">MPLADS Sentinel Portal</span>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-sm space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="w-10 h-10 bg-slate-900 rounded-lg mx-auto flex items-center justify-center text-white mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">MPLADS Sentinel</h1>
            <p className="text-xs text-slate-500 mt-0.5">Role-Based Intelligence & Decision Support Platform</p>
          </div>

          {/* Role Selector BEFORE Login */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Stakeholder Role Before Sign In:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{r.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{r.short}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Context Description */}
            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Assigned Dashboard: </span>
              {selectedRole.description}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Official NIC Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <span>Sign In as {selectedRole.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Active Profile Info */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Profile: <b>{selectedRole.fullName}</b></span>
            <span>{selectedRole.jurisdiction}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-200">
        Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.
      </div>
    </div>
  );
}
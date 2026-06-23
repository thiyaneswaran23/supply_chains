import { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SUPPLY_CHAIN_MANAGER');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering ? { username, password, role } : { username, password };

    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, payload);
      if (isRegistering) {
        setMessage('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        // Safe context storage allocation
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        onLoginSuccess(response.data);
      }
    } catch (error) {
      setMessage(error.response?.data || 'Network operational authentication failure');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 text-slate-100">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
            <Shield size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">SupplyLens AI</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isRegistering ? 'Create your operational access profile' : 'Sign in to management control node'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Username identifier"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Access credentials key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Assign Framework Authority Role</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="SUPPLY_CHAIN_MANAGER">Supply Chain Manager (ML Enabled)</option>
                  <option value="WAREHOUSE_SUPERVISOR">Warehouse Operations Supervisor</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 shadow-md transition-all active:scale-98"
            >
              {isRegistering ? 'Register Access Nodes' : 'Initialize Session Entry'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {isRegistering ? 'Already registered? System Login' : 'Deploy new structural node profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
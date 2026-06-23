import React from 'react';
import { LayoutDashboard, BarChart3, PlusCircle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userRole }) {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 space-y-2 hidden md:block">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">Operations Console</p>
      
      <button 
        onClick={() => setActiveTab('overview')} 
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
          activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard size={18} />
        <span>Current Status</span>
      </button>

      {userRole === 'SUPPLY_CHAIN_MANAGER' && (
        <>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={18} />
            <span>Demand Analytics</span>
          </button>

          <button 
            onClick={() => setActiveTab('dispatch')} 
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'dispatch' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <PlusCircle size={18} />
            <span>Dispatch Pipeline</span>
          </button>
        </>
      )}
    </aside>
  );
}
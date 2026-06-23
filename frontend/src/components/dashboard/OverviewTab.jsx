import React from 'react';
import { Truck, Package, AlertTriangle } from 'lucide-react';
import MetricCard from '../MetricCard';

export default function OverviewTab({ shipments, lowStock, handleDelivery }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Active Logistics Pipeline" value={shipments.length} icon={Truck} />
        <MetricCard title="Low Stock Breaches" value={lowStock.length} icon={Package} alert={lowStock.length > 0} />
        <MetricCard title="Low Stock System Risk Index" value={lowStock.length > 0 ? "ELEVATED" : "OPTIMAL"} icon={AlertTriangle} alert={lowStock.length > 0} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold tracking-tight">Logistics Transit Vector Pipeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/40 uppercase tracking-wider text-xs text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Route Manifest</th>
                <th className="px-6 py-3.5">Logistics Mode</th>
                <th className="px-6 py-3.5">Cargo Count</th>
                <th className="px-6 py-3.5">AI Delay Risk</th>
                <th className="px-6 py-3.5">Pipeline Status</th>
                <th className="px-6 py-3.5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {shipments.map((s) => (
                <tr key={s.shipmentId} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-200">{s.origin} → {s.destination}</td>
                  <td className="px-6 py-4 text-slate-400">{s.transportMode}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono">{s.quantity} Units</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold font-mono ${s.delayProbabilityPct > 0.4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(s.delayProbabilityPct * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${s.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.status !== 'DELIVERED' && (
                      <button onClick={() => handleDelivery(s.shipmentId)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all">
                        Confirm Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
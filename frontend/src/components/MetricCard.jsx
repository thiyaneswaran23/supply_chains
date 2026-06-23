

export default function MetricCard({ title, value, icon: Icon, alert }) {
  return (
    <div className={`p-6 rounded-2xl bg-slate-800 border transition-all ${alert ? 'border-amber-500/30 shadow-amber-900/10' : 'border-slate-700 shadow-lg'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${alert ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-600/10 text-blue-400'}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Package, Truck, AlertTriangle, LogOut, TrendingUp, RefreshCw, PlusCircle } from 'lucide-react';
import MetricCard from './MetricCard';

export default function Dashboard({ user, onLogout }) {
  const [shipments, setShipments] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Form states for live data entry
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [newShipment, setNewShipment] = useState({
    origin: '', destination: '', quantity: '', transportMode: 'ROAD', estimatedDelivery: ''
  });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchData = async () => {
    try {
      const shipRes = await axios.get('http://localhost:8080/api/shipments', getAuthHeader());
      setShipments(shipRes.data);

      const stockRes = await axios.get('http://localhost:8080/api/inventories/low-stock', getAuthHeader());
      setLowStock(stockRes.data);
    } catch (err) {
      console.error("Operational metric collection exception", err);
    }
  };

  const fetchForecast = async () => {
    if (user.role !== 'SUPPLY_CHAIN_MANAGER') return;
    setLoadingForecast(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/analytics/forecast/${selectedProductId}`, getAuthHeader());
      setForecastData(res.data);
    } catch (err) {
      console.error("Forecast fetch error", err);
    } finally {
      setLoadingForecast(false);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        origin: newShipment.origin,
        destination: newShipment.destination,
        quantity: parseInt(newShipment.quantity, 10),
        transportMode: newShipment.transportMode,
        status: 'IN_TRANSIT',
        estimatedDelivery: newShipment.estimatedDelivery || new Date().toISOString().split('T')[0]
      };

      await axios.post('http://localhost:8080/api/shipments', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewShipment({ origin: '', destination: '', quantity: '', transportMode: 'ROAD', estimatedDelivery: '' });
      setShowShipmentForm(false);
      fetchData(); 
    } catch (err) {
      console.error("Pipeline post failure", err);
      alert("Error committing shipment parameters to transaction log.");
    }
  };

  const handleDelivery = async (shipmentId) => {
    try {
      // 🟢 CORRECTED EXPLICIT ARGUMENTS: URL, Empty Body {}, Security Config Headers
      await axios.put(`http://localhost:8080/api/shipments/deliver/${shipmentId}`, {}, getAuthHeader());
      
      fetchData(); // Refreshes the tracking table grid immediately
    } catch (err) {
      console.error("Delivery transaction failure details:", err);
      alert("Unauthorized operational execution block.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [selectedProductId]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Navbar Banner */}
      <nav className="border-b border-slate-800 bg-slate-800/50 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">SL</div>
          <span className="text-xl font-bold tracking-tight">SupplyLens Hub</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase tracking-wider">{user.role.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">Operator: <strong className="text-slate-200">{user.username}</strong></span>
          <button onClick={onLogout} className="flex items-center space-x-1 text-sm font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all">
            <LogOut size={16} />
            <span>Terminate</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Active Logistics Pipeline" value={shipments.length} icon={Truck} />
          <MetricCard title="Low Stock Breaches" value={lowStock.length} icon={Package} alert={lowStock.length > 0} />
          <MetricCard title="Low Stock System Risk Index" value={lowStock.length > 0 ? "ELEVATED" : "OPTIMAL"} icon={AlertTriangle} alert={lowStock.length > 0} />
        </div>

        {/* Action Controls Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Operations Panel</h2>
          {user.role === 'SUPPLY_CHAIN_MANAGER' && (
            <button 
              onClick={() => setShowShipmentForm(!showShipmentForm)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              <span>Dispatch New Shipment</span>
            </button>
          )}
        </div>

        {/* Dynamic Entry Form Section */}
        {showShipmentForm && (
          <form onSubmit={handleCreateShipment} className="p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-6 gap-4 items-end animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Origin Hub</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} placeholder="e.g. Mumbai Hub" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Destination Node</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} placeholder="e.g. Chennai Alpha" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cargo Quantity</label>
              <input type="number" required min="1" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={newShipment.quantity} onChange={e => setNewShipment({...newShipment, quantity: e.target.value})} placeholder="Count" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Transit Mode</label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={newShipment.transportMode} onChange={e => setNewShipment({...newShipment, transportMode: e.target.value})}>
                <option value="ROAD">Road Freight</option>
                <option value="RAIL">Rail Freight</option>
                <option value="SEA">Sea Cargo</option>
                <option value="AIR">Air Express</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Delivery Deadline</label>
              <input type="date" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={newShipment.estimatedDelivery} onChange={e => setNewShipment({...newShipment, estimatedDelivery: e.target.value})} />
            </div>
            <div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-lg text-sm shadow-md transition-all">
                Commit to Pipeline
              </button>
            </div>
          </form>
        )}

        {/* Machine Learning Forecasting UI */}
        {user.role === 'SUPPLY_CHAIN_MANAGER' && (
          <div className="p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-blue-500" size={22} />
                <h3 className="text-lg font-bold tracking-tight">Python ML Demand Predictive Forecaster</h3>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400 font-medium">Target ID Key:</label>
                <input type="number" min="1" className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center font-bold focus:outline-none focus:border-blue-500" value={selectedProductId} onChange={(e) => setSelectedProductId(Number(e.target.value))} />
                <button onClick={fetchForecast} className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600">
                  <RefreshCw size={16} className={loadingForecast ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="h-64 w-full bg-slate-950/40 p-2 rounded-xl border border-slate-800">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                  <Area type="monotone" dataKey="units_sold" name="Demand Metric" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table Matrix */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-bold tracking-tight">Logistics Transit Vector Pipeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 uppercase tracking-wider text-xs text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Route Manifest</th>
                  <th className="px-6 py-3.5">Logistics Mode</th>
                  <th className="px-6 py-3.5">Cargo Count</th>
                  <th className="px-6 py-3.5">AI Delay Risk Percentage</th>
                  <th className="px-6 py-3.5">Pipeline Status</th>
                  <th className="px-6 py-3.5 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {shipments.map((s) => (
                  <tr key={s.shipmentId} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{s.origin} → {s.destination}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{s.transportMode}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{s.quantity} Units</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold font-mono ${s.delayProbabilityPct > 0.4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {(s.delayProbabilityPct * 100).toFixed(1)}% Risk
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${s.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.status !== 'DELIVERED' && (
                        <button 
                          onClick={() => handleDelivery(s.shipmentId)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
                        >
                          Confirm Delivery Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500 font-medium">No active logistics pipeline records found. Add a shipment above to populate the tracking matrix.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
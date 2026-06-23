import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, RefreshCw } from 'lucide-react';

export default function AnalyticsTab({ forecastData, selectedProductId, setSelectedProductId, fetchForecast, loadingForecast }) {
  const [products, setProducts] = useState([]);

  // Fetch the entire active catalog from your MySQL database via Spring Boot
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load product list matrix:", err);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-500" size={22} />
          <h3 className="text-lg font-bold tracking-tight">Python ML Demand Predictive Forecaster</h3>
        </div>
        
        <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 min-w-[360px] relative">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Filter Catalog:</label>
          <select 
            className="w-full bg-transparent text-sm font-bold text-slate-200 focus:outline-none cursor-pointer appearance-none pr-6"
            value={selectedProductId} 
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
          >
            {/* 🟢 DYNAMIC MAPPING: Render exactly what exists inside your MySQL product table */}
            {products.map(p => (
              <option key={p.productId} value={p.productId} className="bg-slate-900 text-slate-200">
                [{p.category}] {p.name} (SKU: {p.sku})
              </option>
            ))}
            {products.length === 0 && <option value={1}>Loading system catalog items...</option>}
          </select>
          <div className="absolute right-9 pointer-events-none text-slate-500 text-xs">▼</div>
          <button onClick={fetchForecast} className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800">
            <RefreshCw size={14} className={loadingForecast ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="h-80 w-full bg-slate-950/40 p-4 rounded-xl border border-slate-850">
        <ResponsiveContainer width="100%" height="100%">
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
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
            <Area type="monotone" dataKey="units_sold" name="Demand Metric" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
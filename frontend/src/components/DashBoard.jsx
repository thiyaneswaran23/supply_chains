import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 🟢 FIXED: Clean single axios import
import { LogOut } from 'lucide-react';

// 🟢 FIXED: Internal paths resolved directly within the components root folder
import Sidebar from './dashboard/SideBar';
import OverviewTab from './dashboard/OverviewTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import DispatchTab from './dashboard/DispatchTab';


export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [shipments, setShipments] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [loadingForecast, setLoadingForecast] = useState(false);
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
      await axios.post('http://localhost:8080/api/shipments', {
        ...newShipment,
        quantity: parseInt(newShipment.quantity, 10),
        status: 'IN_TRANSIT',
        estimatedDelivery: newShipment.estimatedDelivery || new Date().toISOString().split('T')[0]
      }, getAuthHeader());
      
      setNewShipment({ origin: '', destination: '', quantity: '', transportMode: 'ROAD', estimatedDelivery: '' });
      fetchData(); 
      setActiveTab('overview');
      alert("Shipment parameters committed successfully!");
    } catch (err) {
      alert("Error committing shipment parameters.");
    }
  };

  const handleDelivery = async (shipmentId) => {
    try {
      await axios.put(`http://localhost:8080/api/shipments/deliver/${shipmentId}`, {}, getAuthHeader());
      fetchData();
    } catch (err) {
      alert("Unauthorized execution block.");
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchForecast(); }, [selectedProductId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navbar Banner */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">SL</div>
          <span className="text-xl font-bold tracking-tight">SupplyLens Hub</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase tracking-wider">
            {user.role.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">Operator: <strong className="text-slate-200">{user.username}</strong></span>
          <button onClick={onLogout} className="flex items-center space-x-1 text-sm font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all">
            <LogOut size={16} />
            <span>Terminate</span>
          </button>
        </div>
      </nav>

      {/* Main Structural Hub Layout Wrapper */}
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
        
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab shipments={shipments} lowStock={lowStock} handleDelivery={handleDelivery} />
          )}
          {activeTab === 'analytics' && user.role === 'SUPPLY_CHAIN_MANAGER' && (
            <AnalyticsTab 
              forecastData={forecastData} 
              selectedProductId={selectedProductId} 
              setSelectedProductId={setSelectedProductId} 
              fetchForecast={fetchForecast} 
              loadingForecast={loadingForecast} 
            />
          )}
          {activeTab === 'dispatch' && user.role === 'SUPPLY_CHAIN_MANAGER' && (
            <DispatchTab 
              newShipment={newShipment} 
              setNewShipment={setNewShipment} 
              handleCreateShipment={handleCreateShipment} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
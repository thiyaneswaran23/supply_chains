import React, { useState } from 'react';
import axios from 'axios';
import { Ship, PlusCircle } from 'lucide-react';

export default function DispatchTab({ newShipment, setNewShipment, handleCreateShipment, fetchForecast }) {
  // Local state for registering a new product catalog item
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: '', price: '' });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        sku: productForm.sku,
        category: productForm.category,
        price: parseFloat(productForm.price)
      };

      await axios.post('http://localhost:8080/api/products', payload, getAuthHeader());
      setProductForm({ name: '', sku: '', category: '', price: '' });
      alert("📦 New Product successfully cataloged in core database!");
      
      // If a parent refresh callback exists, reload the dropdown options list
      if (fetchForecast) window.location.reload(); 
    } catch (err) {
      console.error("Failed to commit product catalog definition:", err);
      alert("Error saving new product definitions to transaction log.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* FORM 1: BRAND NEW PRODUCT REGISTRATION CATALOG (1/3 Width) */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <PlusCircle className="text-emerald-500" size={20} />
            <h3 className="text-md font-bold tracking-tight text-slate-200">Catalog New Product Item</h3>
          </div>
          
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Product Name</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="e.g., Graphics Card RTX 5080" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">SKU Code</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} placeholder="e.g., GPU-RTX-5080" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Category</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder="e.g., Hardware" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Unit Price (INR)</label>
              <input type="number" required step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} placeholder="e.g., 95000" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all">
              Add Item to System Catalog
            </button>
          </form>
        </div>

        {/* FORM 2: LOGISTICS PIPELINE SHIPMENT MANIFEST DISPATCH (2/3 Width) */}
        <div className="md:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Ship className="text-blue-500" size={22} />
            <h3 className="text-lg font-bold tracking-tight">Initialize Logistics Pipeline Manifest</h3>
          </div>
          
          <form onSubmit={handleCreateShipment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Origin Hub Node</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} placeholder="e.g. Mumbai Port Terminal" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Destination Delivery Node</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} placeholder="e.g. Chennai Central Distribution" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Cargo Quantity Count</label>
              <input type="number" required min="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" value={newShipment.quantity} onChange={e => setNewShipment({...newShipment, quantity: e.target.value})} placeholder="e.g. 150" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Transit Freight Vector Mode</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer" value={newShipment.transportMode} onChange={e => setNewShipment({...newShipment, transportMode: e.target.value})}>
                <option value="ROAD">Road Freight Carrier</option>
                <option value="RAIL">Rail Cargo Vector</option>
                <option value="SEA">Sea Container Transporter</option>
                <option value="AIR">Air Express Transporter</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Contractual Delivery Deadline</label>
              <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" value={newShipment.estimatedDelivery} onChange={e => setNewShipment({...newShipment, estimatedDelivery: e.target.value})} />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all transform active:scale-[0.99]">
                Commit Manifest & Request AI Evaluation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
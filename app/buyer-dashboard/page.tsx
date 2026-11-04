'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BuyerDashboardPage() {
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedParish, setSelectedParish] = useState('All Parishes');

  // Available Produce Listings with Photo URLs
  const [listings, setListings] = useState([
    {
      id: 101,
      farmer: 'Marcus Reid',
      radaId: '#84920',
      parish: 'St. Elizabeth',
      crop: 'Sweet Pepper',
      totalAvailableLbs: 1500,
      price: 380,
      grade: 'Grade A',
      delivery: 'Farm Gate Pickup',
      photo: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 102,
      farmer: 'Devon Campbell',
      radaId: '#39201',
      parish: 'Manchester',
      crop: 'Irish Potato',
      totalAvailableLbs: 3000,
      price: 210,
      grade: 'Grade A',
      delivery: 'Refrigerated Truck',
      photo: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 103,
      farmer: 'Oraine Thompson',
      radaId: '#58392',
      parish: 'Trelawny',
      crop: 'Yellow Yam',
      totalAvailableLbs: 1200,
      price: 195,
      grade: 'Grade B',
      delivery: 'Wholesale Dropoff',
      photo: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500&auto=format&fit=crop&q=60',
    },
  ]);

  // Orders State
  const [myOrders, setMyOrders] = useState([
    {
      id: 901,
      crop: 'Scotch Bonnet Pepper',
      farmer: 'Keneisha Sterling',
      quantityBought: '500 lbs',
      totalCost: '$190,000 JMD',
      paymentMethod: 'Debit/Credit Card (Escrow Locked)',
      status: 'PAID - IN TRANSIT',
      date: '2026-11-02',
    },
  ]);

  // Checkout Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [orderQty, setOrderQty] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  // Card Input Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const filteredListings = listings.filter((item) => {
    const matchesCrop = item.crop.toLowerCase().includes(searchCrop.toLowerCase());
    const matchesParish = selectedParish === 'All Parishes' || item.parish === selectedParish;
    return matchesCrop && matchesParish;
  });

  const handleOpenCheckout = (item: any) => {
    setSelectedItem(item);
    setOrderQty(Math.min(100, item.totalAvailableLbs));
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || orderQty <= 0) return;

    const totalJMD = orderQty * selectedItem.price;

    const newOrder = {
      id: Date.now(),
      crop: selectedItem.crop,
      farmer: selectedItem.farmer,
      quantityBought: `${orderQty} lbs`,
      totalCost: `$${totalJMD.toLocaleString()} JMD`,
      paymentMethod: paymentMethod === 'card' ? 'Debit/Credit Card (Escrow Held)' : 'Cash on Delivery',
      status: paymentMethod === 'card' ? 'PAID & ESCROW LOCKED' : 'CONFIRMED (CASH ON DELIVERY)',
      date: new Date().toISOString().split('T')[0],
    };

    setMyOrders([newOrder, ...myOrders]);

    // Update or remove listing based on remaining quantity
    setListings((prev) =>
      prev
        .map((item) => {
          if (item.id === selectedItem.id) {
            const remaining = item.totalAvailableLbs - orderQty;
            return { ...item, totalAvailableLbs: remaining };
          }
          return item;
        })
        .filter((item) => item.totalAvailableLbs > 0)
    );

    setSelectedItem(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans text-gray-900">
      
      {/* BACKGROUND OVERLAY */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url("/images/Buyer's-Dashboard-Background.jfif")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-indigo-950/75 to-slate-950/90 backdrop-blur-[1px]"></div>
      </div>

      {/* HEADER BAR */}
      <header className="bg-white/95 border-b border-white/20 px-6 sm:px-8 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md shadow-lg h-20">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center shrink-0 cursor-pointer">
            <img src="/images/logo.png" alt="Agri-Connect JA Logo" className="h-14 w-auto object-contain drop-shadow-xs" />
          </Link>
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <span className="font-black text-indigo-950 text-base sm:text-lg tracking-wide whitespace-nowrap">
            Commercial Buyer Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm font-black bg-indigo-100 text-indigo-900 px-3.5 py-1.5 rounded-full border border-indigo-300">
             Commercial Procurement
          </span>
          <Link href="/login" className="text-xs sm:text-sm font-black text-gray-800 hover:text-indigo-800">
            Sign Out
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8 z-10">
        
        {/* SEARCH & FILTERS */}
        <div className="bg-white/65 border border-white/50 backdrop-blur-md rounded-3xl shadow-xl p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-indigo-950">Produce Sourcing & Partial Orders</h1>
            <p className="text-xs sm:text-sm font-bold text-gray-700">Select any quantity required and pay securely via Card Escrow or Cash on Delivery.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by crop name..."
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900"
            />
            <select
              value={selectedParish}
              onChange={(e) => setSelectedParish(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900"
            >
              <option value="All Parishes">All 14 Parishes</option>
              <option value="St. Elizabeth">St. Elizabeth</option>
              <option value="Manchester">Manchester</option>
              <option value="Trelawny">Trelawny</option>
            </select>
          </div>
        </div>

        {/* PRODUCE LISTINGS GRID */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white">Live Farmer Produce Feed ({filteredListings.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div key={item.id} className="bg-white/90 rounded-3xl border border-white shadow-xl overflow-hidden flex flex-col justify-between">
                
                {/* PRODUCE PHOTO HEADER */}
                <div className="relative h-48 w-full bg-gray-200">
                  <img src={item.photo} alt={item.crop} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/20">
                    📍 {item.parish}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-700 text-white text-xs font-black px-2.5 py-1 rounded-md">
                    {item.grade}
                  </span>
                </div>

                {/* CARD BODY */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-indigo-950">{item.crop}</h3>
                    <p className="text-xs font-bold text-gray-600">
                      Farmer: <span className="text-gray-900 font-extrabold">{item.farmer}</span> ({item.radaId})
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-1 text-xs font-bold">
                    <div className="flex justify-between text-gray-700">
                      <span>Total Available:</span>
                      <span className="font-black text-emerald-800">{item.totalAvailableLbs.toLocaleString()} lbs</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Price per lb:</span>
                      <span className="font-black text-blue-800 text-sm">${item.price} JMD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(item)}
                    className="w-full bg-[#ccff00] hover:bg-lime-400 text-emerald-950 font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 mt-2"
                  >
                     Select Quantity & Order →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MY ORDERS TABLE */}
        <div className="bg-white/65 border border-white/50 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-indigo-950">Procurement Order History ({myOrders.length})</h2>

          <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white/80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-indigo-950 text-white font-black">
                <tr>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">Farmer</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Total Cost</th>
                  <th className="p-3.5">Payment Type</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-bold text-gray-800">
                {myOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-indigo-50/50">
                    <td className="p-3.5 font-black text-indigo-950">{order.crop}</td>
                    <td className="p-3.5">{order.farmer}</td>
                    <td className="p-3.5">{order.quantityBought}</td>
                    <td className="p-3.5 text-blue-800 font-black">{order.totalCost}</td>
                    <td className="p-3.5">{order.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* CHECKOUT & PAYMENT MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-gray-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-black text-indigo-900 uppercase">Checkout Produce</span>
                <h3 className="text-2xl font-black text-indigo-950">{selectedItem.crop}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 font-black text-xl px-2">
                ✕
              </button>
            </div>

            {/* PARTIAL QUANTITY SELECTOR */}
            <div className="bg-indigo-50/70 p-4 rounded-2xl space-y-3 text-xs sm:text-sm font-bold text-indigo-950">
              <div className="flex justify-between items-center">
                <span>Max Available:</span>
                <span className="font-black text-emerald-800">{selectedItem.totalAvailableLbs.toLocaleString()} lbs</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-800 block">Enter Needed Quantity (lbs):</label>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.totalAvailableLbs}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Math.min(selectedItem.totalAvailableLbs, Math.max(1, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-black text-gray-900"
                />
              </div>

              <div className="flex justify-between text-base font-black text-blue-950 pt-2 border-t border-indigo-200">
                <span>Calculated Total:</span>
                <span>${(orderQty * selectedItem.price).toLocaleString()} JMD</span>
              </div>
            </div>

            {/* PAYMENT CHOICE & CARD FORM */}
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-800 block">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-indigo-900 text-white border-indigo-900 shadow-md' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                     Card (Escrow Hold)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                      paymentMethod === 'cash' ? 'bg-indigo-900 text-white border-indigo-900 shadow-md' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                     Cash on Delivery
                  </button>
                </div>
              </div>

              {/* CARD INPUT FIELDS */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sandals Procurement Ltd"
                      value={cardDetails.cardHolder}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-700">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4111 •••• •••• 8841"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="08/28"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-700">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#ccff00] hover:bg-lime-400 text-emerald-950 font-black text-sm py-3.5 rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                Confirm Payment of ${(orderQty * selectedItem.price).toLocaleString()} JMD →
              </button>
            </form>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-emerald-100/80 z-10 gap-2">
        <span>© 2026 Agri-Connect JA. All Rights Reserved.</span>
      </footer>

    </div>
  );
}
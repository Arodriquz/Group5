'use client';

import React, { useState } from 'react';

// =========================================
// CLEAN MULTI-METRIC CONCENTRIC RING GAUGE
// =========================================
function MultiSensorRing({
  moisture,
  temp,
  humidity,
  uvIndex,
}: {
  moisture: number;
  temp: number;
  humidity: number;
  uvIndex: number;
}) {
  const metrics = [
    { label: 'Moisture', val: moisture, color: '#16a34a', radius: 42 }, // Green
    { label: 'Humidity', val: humidity, color: '#0284c7', radius: 34 }, // Blue
    { label: 'Temp', val: Math.round((temp / 50) * 100), color: '#eab308', radius: 26 }, // Yellow
    { label: 'UV Index', val: Math.round((uvIndex / 12) * 100), color: '#a855f7', radius: 18 }, // Purple
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-300 rounded-xl shadow-xs">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {metrics.map((m, i) => {
            const circumference = 2 * Math.PI * m.radius;
            const strokeDashoffset = circumference - (Math.min(m.val, 100) / 100) * circumference;
            return (
              <React.Fragment key={i}>
                <circle
                  cx="50"
                  cy="50"
                  r={m.radius}
                  className="stroke-gray-100"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={m.radius}
                  stroke={m.color}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// =========================================
// MAIN DASHBOARD COMPONENT
// =========================================
export default function FarmerDashboard() {
  // Authentication and screen state
  const [activeScreen, setActiveScreen] = useState<'auth' | 'dashboard'>('auth');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | 'admin'>('farmer');

  // Active dashboard view state (Main Telemetry vs Action Forms)
  const [dashboardView, setDashboardView] = useState<'main' | 'harvest' | 'loss' | 'market'>('main');

  // Registration form state
  const [fullName, setFullName] = useState('Farmer Brown');
  const [parish, setParish] = useState('St. Elizabeth');
  const [cropChoice, setCropChoice] = useState('Sweet Pepper (0.5 Ha)|35%|Feb 15, 2027');

  // Dashboard telemetry and crop state
  const [moisture, setMoisture] = useState(32);
  const [moistureStatus, setMoistureStatus] = useState<'normal' | 'low' | 'optimal'>('low');
  const [cropDisplay, setCropDisplay] = useState('Sweet Pepper (0.5 Ha)');
  const [plantDate, setPlantDate] = useState('Oct 12, 2026');
  const [harvestDate, setHarvestDate] = useState('Feb 15, 2027');
  const [cropName, setCropName] = useState('Sweet Pepper');
  const [threshold, setThreshold] = useState(35);

  // Crop modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCrop, setModalCrop] = useState('Tomato (0.5 Ha)|30%|Jan 15, 2027');
  const [modalPlantDate, setModalPlantDate] = useState('2026-10-14');

  // Alert state
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Authentication submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authTab === 'register') {
      const parts = cropChoice.split('|');

      setCropDisplay(parts[0]);
      setHarvestDate(parts[2]);
      setCropName(parts[0].split(' ')[0]);
      setThreshold(parseInt(parts[1]));
    }

    setAlertDismissed(false);
    setActiveScreen('dashboard');
    setDashboardView('main');
  };

  // Logout
  const handleLogout = () => {
    setActiveScreen('auth');
    setAuthTab('login');
  };

  // Irrigation pump demonstration
  const triggerPump = () => {
    alert('Command sent: Drip Irrigation Pump activated!');
    setMoisture(45);
    setMoistureStatus('optimal');
    setAlertDismissed(true);
  };

  // Save new crop cycle
  const handleSaveNewCrop = () => {
    const parts = modalCrop.split('|');

    setCropDisplay(parts[0]);
    setPlantDate(
      modalPlantDate
        ? new Date(modalPlantDate + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Oct 14, 2026'
    );
    setHarvestDate(parts[2]);
    setCropName(parts[0].split(' ')[0]);
    setThreshold(parseInt(parts[1]));

    setIsModalOpen(false);
    setAlertDismissed(false);

    alert('Crop cycle updated successfully! System thresholds adjusted for ' + parts[0].split(' ')[0]);
  };

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#333] flex justify-center items-center p-3 font-sans">

      {/* MAIN APPLICATION CARD */}
      <div
        className={`w-full max-w-[460px] rounded-2xl shadow-2xl overflow-hidden relative ${
          activeScreen === 'auth' ? 'auth-background' : 'bg-white'
        }`}
      >

        {/* ========================================= */}
        {/* LOGIN AND REGISTRATION SCREEN */}
        {/* ========================================= */}

        {activeScreen === 'auth' && (
          <div className="auth-overlay">

            {/* BRAND HEADER */}
            <header className="auth-header">
              <div className="auth-brand-icon text-3xl mb-1">🌱</div>

              <h1 className="text-3xl font-black tracking-wide drop-shadow-md">
                Agri-Connect JA
              </h1>

              <p className="text-base font-semibold text-white mt-2 drop-shadow-sm">
                Connecting Jamaican Farmers to a Smarter Future
              </p>

              <div className="auth-header-line"></div>
            </header>

            {/* AUTHENTICATION CONTENT */}
            <section className="auth-content bg-white/80 backdrop-blur-md">

              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f2d1e]">
                  {authTab === 'login'
                    ? 'Welcome Back'
                    : 'Join Our Farming Community'}
                </h2>

                <p className="text-base sm:text-lg font-bold text-[#0f2d1e] mt-1.5 leading-snug">
                  {authTab === 'login'
                    ? 'Sign in to access your farming dashboard.'
                    : 'Create your account and get started.'}
                </p>
              </div>

              {/* LOGIN / REGISTER TABS */}
              <div className="flex bg-[#d2e3d5] p-1.5 rounded-xl mb-6 shadow-inner border border-[#b4d2bb]">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-3 text-base font-black rounded-lg transition-all ${
                    authTab === 'login'
                      ? 'bg-[#1b5e20] text-white shadow-md'
                      : 'text-[#1e3b2b] hover:bg-white/60'
                  }`}
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`flex-1 py-3 text-base font-black rounded-lg transition-all ${
                    authTab === 'register'
                      ? 'bg-[#1b5e20] text-white shadow-md'
                      : 'text-[#1e3b2b] hover:bg-white/60'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* ACCOUNT TYPE */}
              <div className="mb-5">
                <label className="block text-sm font-black text-[#0f2d1e] mb-2 uppercase tracking-wide">
                  Select Account Type
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {(['farmer', 'buyer', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`border-2 rounded-xl p-3 text-center text-base font-black capitalize transition-all ${
                        selectedRole === role
                          ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20] shadow-md ring-2 ring-[#1b5e20]/20'
                          : 'border-gray-300 bg-white text-[#222222] hover:border-[#2e7d32]'
                      }`}
                    >
                      <span className="block text-2xl mb-1">
                        {role === 'farmer' ? '🌾' : role === 'buyer' ? '🛒' : '⚙️'}
                      </span>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* BUYER AND ADMIN NOTICE */}
              {selectedRole !== 'farmer' && (
                <div className="mb-5 p-3 bg-blue-100 border border-blue-400 rounded-xl text-xs font-bold text-blue-950 text-center shadow-xs">
                  <strong>Note:</strong> Buyer and Admin dashboards are under development by team members. Selecting this role will redirect to the Farmer Dashboard for testing.
                </div>
              )}

              {/* AUTHENTICATION FORM */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-[#0f2d1e]">
                    Phone / Email
                  </label>

                  <input
                    type="text"
                    className="auth-input font-semibold text-[#111111]"
                    placeholder="e.g. 876-555-0192"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-black text-[#0f2d1e]">
                    Password
                  </label>

                  <input
                    type="password"
                    className="auth-input font-semibold text-[#111111]"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* REGISTRATION FIELDS */}
                {authTab === 'register' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-black text-[#0f2d1e]">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="auth-input font-semibold text-[#111111]"
                        placeholder="e.g. Farmer Brown"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-black text-[#0f2d1e]">
                        Parish Location
                      </label>

                      <select
                        value={parish}
                        onChange={(e) => setParish(e.target.value)}
                        className="auth-input font-semibold text-[#111111]"
                      >
                        <option value="St. Elizabeth">St. Elizabeth</option>
                        <option value="Clarendon">Clarendon</option>
                        <option value="Manchester">Manchester</option>
                        <option value="St. Ann">St. Ann</option>
                        <option value="St. Mary">St. Mary</option>
                        <option value="Trelawny">Trelawny</option>
                        <option value="Westmoreland">Westmoreland</option>
                        <option value="Portland">Portland</option>
                        <option value="St. Catherine">St. Catherine</option>
                        <option value="St. Thomas">St. Thomas</option>
                        <option value="Hanover">Hanover</option>
                        <option value="St. James">St. James</option>
                        <option value="Kingston & St. Andrew">Kingston & St. Andrew</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-black text-[#0f2d1e]">
                        Primary Crop
                      </label>

                      <select
                        value={cropChoice}
                        onChange={(e) => setCropChoice(e.target.value)}
                        className="auth-input font-semibold text-[#111111]"
                      >
                        <option value="Sweet Pepper (0.5 Ha)|35%|Feb 15, 2027">
                          Sweet Pepper (0.5 Ha)
                        </option>
                        <option value="Tomato (0.5 Ha)|30%|Jan 15, 2027">
                          Tomato (0.5 Ha)
                        </option>
                        <option value="Cabbage (0.5 Ha)|25%|Dec 20, 2026">
                          Cabbage (0.5 Ha)
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="auth-submit-button text-base font-extrabold tracking-wide mt-2"
                >
                  {authTab === 'register'
                    ? 'Create Account & Continue'
                    : 'Log In to Portal'}
                  <span className="ml-2">→</span>
                </button>
              </form>

              <div className="text-center text-xs font-bold text-[#1b5e20] mt-5 bg-[#e8f5e9] py-1.5 rounded-full border border-[#a5d6a7]">
                <span>●</span> Agri-Connect PWA Ready
              </div>

            </section>

            {/* FOOTER */}
            <footer className="auth-footer text-xs font-bold tracking-wide">
              Empowering Agriculture • Growing Jamaica
            </footer>

          </div>
        )}

        {/* ========================================= */}
        {/* FARMER DASHBOARD */}
        {/* ========================================= */}

        {activeScreen === 'dashboard' && (
          <div className="bg-white/85 min-h-full pb-4">

            {/* DASHBOARD HEADER WITH BACKGROUND IMAGE */}
            <header className="dashboard-header text-white p-5 text-center relative overflow-hidden rounded-t-2xl shadow-md">
              <div className="absolute inset-0 bg-black/45 z-0" />

              <div className="relative z-10 flex flex-col items-center justify-center min-h-[90px]">
                <button
                  onClick={handleLogout}
                  className="absolute right-0 top-0 bg-white/20 hover:bg-white/35 text-white border border-white/30 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors backdrop-blur-sm shadow-xs"
                >
                  Logout
                </button>

                <div className="text-2xl mb-0.5">🌱</div>

                <h1 className="text-xl font-black tracking-wide drop-shadow-md">
                  Agri-Connect JA
                </h1>

                <p className="text-xs font-bold opacity-95 mt-1 text-[#e8f5e9] drop-shadow-sm">
                  Welcome back, {fullName} ({parish})
                </p>
              </div>
            </header>

            {/* DYNAMIC DASHBOARD CONTENT */}
            {dashboardView === 'main' ? (
              <>
                {/* LIVE SENSOR TELEMETRY */}
                <div className="px-4 mt-4 space-y-2.5">
                  <div className="text-xs uppercase text-[#111] font-black tracking-wide">
                    Live Sensor Telemetry
                  </div>

                  {/* CENTERED RING CHART */}
                  <MultiSensorRing moisture={moisture} temp={29} humidity={75} uvIndex={5} />

                  {/* COMPACT SENSOR STATUS CARDS WITH MATCHING COLOR DOTS */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* MOISTURE - GREEN */}
                    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-2xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                          <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                          Moisture
                        </div>
                        <div className="text-base font-black text-[#1b4332] mt-0.5">{moisture}%</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          moistureStatus === 'optimal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {moistureStatus === 'optimal' ? 'Optimal' : '⚠️ LOW'}
                      </span>
                    </div>

                    {/* TEMP - YELLOW */}
                    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-2xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                          <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                          Temp
                        </div>
                        <div className="text-base font-black text-[#1b4332] mt-0.5">29°C</div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Normal
                      </span>
                    </div>

                    {/* HUMIDITY - BLUE */}
                    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-2xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                          <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                          Humidity
                        </div>
                        <div className="text-base font-black text-[#1b4332] mt-0.5">75%</div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Good
                      </span>
                    </div>

                    {/* UV INDEX - PURPLE */}
                    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-2xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                          <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                          UV Index
                        </div>
                        <div className="text-base font-black text-[#1b4332] mt-0.5">5</div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Moderate
                      </span>
                    </div>

                  </div>

                  {/* AIR QUALITY */}
                  <div className="bg-[#e8f5e9] border border-[#a5d6a7] p-2.5 rounded-lg text-xs flex justify-between items-center shadow-xs text-[#0f2d1e] font-bold">
                    <span><strong>Air Quality:</strong> 35 AQI</span>
                    <span className="text-[0.75rem] font-bold px-2 py-0.5 rounded bg-[#d1e7dd] text-[#0f5132]">
                      Good
                    </span>
                  </div>
                </div>

                {/* IRRIGATION WARNING */}
                {!alertDismissed && moisture < threshold && (
                  <div className="mx-4 mt-4 bg-[#fff3cd] border-l-4 border-[#ffc107] rounded-lg p-3.5 text-[#533f03] shadow-xs">

                    <div className="font-black text-xs">
                      ⚠️ IRRIGATION WARNING
                    </div>

                    <div className="text-[0.85rem] font-semibold my-1.5 leading-snug">
                      Soil moisture is at <strong>{moisture}%</strong> for <strong>{cropName}</strong> (Threshold: {threshold}%). Recommended: Activate Drip Irrigation.
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={triggerPump}
                        className="bg-[#ffc107] text-[#111111] border-none px-3 py-1.5 rounded-md text-xs font-black cursor-pointer hover:bg-[#e0a800]"
                      >
                        Turn On Water Pump
                      </button>

                      <button
                        onClick={() => setAlertDismissed(true)}
                        className="bg-transparent text-[#533f03] border border-[#533f03] px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>

                  </div>
                )}

                {/* CROP STATUS SUMMARY */}
                <div className="text-xs uppercase text-[#111] font-black mx-4 mt-4 mb-2 flex justify-between items-center tracking-wide">
                  <span>Crop Status Summary</span>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#e8f5e9] text-[#1b5e20] border border-[#1b5e20] px-2.5 py-1 rounded-md text-[0.75rem] font-black cursor-pointer hover:bg-[#c8e6c9]"
                  >
                    + Change Crop
                  </button>
                </div>

                <div className="mx-4 bg-white border border-gray-300 rounded-xl p-3 text-xs space-y-2 shadow-xs font-medium text-[#222]">

                  <div className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                    <span className="font-bold text-[#111]">Active Crop:</span>
                    <span className="font-extrabold text-[#1b5e20]">{cropDisplay}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-gray-300 pb-1.5">
                    <span className="font-bold text-[#111]">Planting Date:</span>
                    <span className="font-semibold">{plantDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold text-[#111]">Est. Harvest:</span>
                    <span className="font-semibold">{harvestDate}</span>
                  </div>

                </div>

                {/* QUICK ACTIONS HORIZONTAL GRID */}
                <div className="text-xs uppercase text-[#111] font-black mx-4 mt-4 mb-2 tracking-wide">
                  Quick Actions
                </div>

                <div className="grid grid-cols-3 gap-2 px-4">
                  {/* LOG HARVEST CARD */}
                  <button
                    onClick={() => setDashboardView('harvest')}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-300 rounded-xl shadow-xs hover:border-[#1b5e20] hover:bg-[#e8f5e9]/50 transition-all cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🌾</span>
                    <span className="text-[11px] font-extrabold text-[#1b5e20] leading-tight text-center">
                      Log Harvest
                    </span>
                  </button>

                  {/* REPORT LOSS CARD */}
                  <button
                    onClick={() => setDashboardView('loss')}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-300 rounded-xl shadow-xs hover:border-[#c62828] hover:bg-red-50/50 transition-all cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚠️</span>
                    <span className="text-[11px] font-extrabold text-[#c62828] leading-tight text-center">
                      Report Loss
                    </span>
                  </button>

                  {/* POST MARKETPLACE CARD */}
                  <button
                    onClick={() => setDashboardView('market')}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-300 rounded-xl shadow-xs hover:border-[#0277bd] hover:bg-sky-50/50 transition-all cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛒</span>
                    <span className="text-[11px] font-extrabold text-[#0277bd] leading-tight text-center">
                      Post Market
                    </span>
                  </button>
                </div>
              </>
            ) : (
              /* DEDICATED SUB-DASHBOARD VIEWS (GREY CONTAINER) */
              <div className="p-4 bg-gray-100 min-h-[420px] space-y-4">
                <button
                  onClick={() => setDashboardView('main')}
                  className="flex items-center gap-1.5 text-xs font-black text-[#1b5e20] bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-[#e8f5e9] transition-colors cursor-pointer shadow-2xs"
                >
                  ← Back to Telemetry
                </button>

                {/* VIEW 1: HARVEST DASHBOARD */}
                {dashboardView === 'harvest' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <span className="text-2xl">🌾</span>
                        <div>
                          <h2 className="text-base font-black text-[#1b5e20]">Daily Harvest Log</h2>
                          <p className="text-[11px] text-gray-500 font-bold">Record yield for your crops</p>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert('Harvest Logged Successfully!');
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block font-black text-gray-700 mb-1">Crop Harvested:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#1b5e20] bg-white">
                            <option value={cropName}>{cropName} (Active Crop)</option>
                            <option value="Tomato">Tomato</option>
                            <option value="Cabbage">Cabbage</option>
                            <option value="Yam">Yam</option>
                            <option value="Scallion">Scallion</option>
                            <option value="Sweet Potato">Sweet Potato</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">Harvest Quantity (lbs):</label>
                          <input
                            type="number"
                            placeholder="e.g. 150"
                            className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#1b5e20]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">Produce Grade:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#1b5e20] bg-white">
                            <option>Grade A - Export Quality (Premium)</option>
                            <option>Grade A - Local Supermarket/Hotel</option>
                            <option>Grade B - Local Wholesale Market</option>
                            <option>Grade C - Processing / Agro-Processor</option>
                            <option>Reject / Cull (Damaged or Oversized)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#1b5e20] text-white font-extrabold rounded-lg shadow-sm hover:bg-[#144718] cursor-pointer"
                        >
                          Save Harvest Log
                        </button>
                      </form>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <h3 className="text-xs font-black text-[#111] uppercase tracking-wide">Recent Harvest Logs</h3>
                        <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#1b5e20] px-2 py-0.5 rounded-full">
                          Total: 320 lbs
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                          <div>
                            <div className="font-extrabold text-[#1b5e20]">Sweet Pepper</div>
                            <div className="text-[10px] text-gray-500 font-semibold">Oct 30, 2026 • Grade A (Export)</div>
                          </div>
                          <span className="font-black text-gray-800">200 lbs</span>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                          <div>
                            <div className="font-extrabold text-[#1b5e20]">Sweet Pepper</div>
                            <div className="text-[10px] text-gray-500 font-semibold">Oct 28, 2026 • Grade B (Wholesale)</div>
                          </div>
                          <span className="font-black text-gray-800">120 lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: CROP LOSS REPORTING */}
                {dashboardView === 'loss' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <h2 className="text-base font-black text-[#c62828]">Report Crop Loss</h2>
                          <p className="text-[11px] text-gray-500 font-bold">
                            Record damaged crops & field management actions
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert('Crop Loss Report Submitted Successfully!');
                          setDashboardView('main');
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block font-black text-gray-700 mb-1">Affected Crop:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#c62828] bg-white">
                            <option value={cropName}>{cropName} (Active Field)</option>
                            <option value="Tomato">Tomato</option>
                            <option value="Cabbage">Cabbage</option>
                            <option value="Yam">Yam</option>
                            <option value="Scallion">Scallion</option>
                            <option value="Sweet Potato">Sweet Potato</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">Primary Cause of Loss:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#c62828] bg-white">
                            <option>Pest / Caterpillar / Worm Infestation</option>
                            <option>Heavy Rainfall / Flooding / Soil Erosion</option>
                            <option>Drought / Extreme Heat / Water Shortage</option>
                            <option>Fungal Infection / Bacterial Blight / Wilt</option>
                            <option>Praedial Larceny (Theft)</option>
                            <option>Wind Damage / Tropical Storm</option>
                            <option>Irrigation Equipment Breakdown</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">Action Taken / Current Status:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#c62828] bg-white">
                            <option value="cleared">Cleared / Removed Crop (Resolved)</option>
                            <option value="treated">Treated Field & Saved Remaining Crop</option>
                            <option value="rada">Request RADA / Parish Inspection</option>
                            <option value="logged">Logged for Personal Records Only</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">Estimated Loss (%):</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="e.g. 25"
                            className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#c62828]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-black text-gray-700 mb-1">
                            Notes & Observations:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="e.g. Cleared affected plants and burned crop waste to prevent spread."
                            className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#c62828] resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#c62828] text-white font-extrabold rounded-lg shadow-sm hover:bg-[#b71c1c] cursor-pointer"
                        >
                          Submit Crop Loss Report
                        </button>
                      </form>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <h3 className="text-xs font-black text-[#111] uppercase tracking-wide">
                          Recent Loss Reports
                        </h3>
                        <span className="text-[10px] font-bold bg-red-100 text-[#c62828] px-2 py-0.5 rounded-full">
                          2 Logs
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-[#c62828]">Sweet Pepper</span>
                              <span className="text-[10px] text-gray-500 font-semibold ml-2">Oct 24, 2026</span>
                            </div>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                              Cleared / Removed
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-gray-800">
                            Cause: Heavy Rainfall / Flooding (20% Loss)
                          </div>
                          <p className="text-[10px] text-gray-600 font-medium italic">
                            "Cleared damaged section and prepped bed for replanting."
                          </p>
                        </div>

                        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-[#c62828]">Tomato</span>
                              <span className="text-[10px] text-gray-500 font-semibold ml-2">Sep 15, 2026</span>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              RADA Inspection
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-gray-800">
                            Cause: Fungal Infection / Blight (15% Loss)
                          </div>
                          <p className="text-[10px] text-gray-600 font-medium italic">
                            "Spotted early leaf blight. Awaiting officer confirmation."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 3: MARKETPLACE SURPLUS */}
                {dashboardView === 'market' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <span className="text-2xl">🛒</span>
                        <div>
                          <h2 className="text-base font-black text-[#0277bd]">Post Produce to Market</h2>
                          <p className="text-[11px] text-gray-500 font-bold">
                            List surplus crops directly for verified commercial buyers
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert('Surplus produce published! Buyers can now place orders.');
                          setDashboardView('main');
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block font-black text-gray-700 mb-1">Crop to Sell:</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#0277bd] bg-white">
                            <option value={cropName}>{cropName} (Active Crop)</option>
                            <option value="Tomato">Tomato</option>
                            <option value="Cabbage">Cabbage</option>
                            <option value="Yam">Yam</option>
                            <option value="Scallion">Scallion</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-black text-gray-700 mb-1">Quantity (lbs):</label>
                            <input
                              type="number"
                              placeholder="e.g. 300"
                              className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#0277bd]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-black text-gray-700 mb-1">Price / lb (JMD):</label>
                            <input
                              type="number"
                              placeholder="e.g. 180"
                              className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#0277bd]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-black text-gray-700 mb-1">Produce Grade:</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#0277bd] bg-white">
                              <option>Grade A (Export/Hotel)</option>
                              <option>Grade B (Wholesale)</option>
                              <option>Grade C (Processing)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-black text-gray-700 mb-1">Delivery Method:</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-gray-800 outline-none focus:border-[#0277bd] bg-white">
                              <option>Farm Pickup Only</option>
                              <option>Parish Delivery Available</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#0277bd] text-white font-extrabold rounded-lg shadow-sm hover:bg-[#01579b] cursor-pointer"
                        >
                          Publish Listing to Buyer Portal
                        </button>
                      </form>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <h3 className="text-xs font-black text-[#111] uppercase tracking-wide">
                          Marketplace Activity
                        </h3>
                        <span className="text-[10px] font-bold bg-sky-100 text-[#0277bd] px-2 py-0.5 rounded-full">
                          1 Active Order
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-[#1b5e20]">🛒 Order Received!</span>
                              <div className="text-[10px] text-gray-600 font-bold">Buyer: Hi-Lo Food Stores</div>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                              Paid / Reserved
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-gray-800 pt-1">
                            <span>200 lbs Sweet Pepper @ $180/lb</span>
                            <span className="text-[#1b5e20]">$36,000 JMD</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-[#0277bd]">Sweet Pepper (Grade A)</span>
                              <div className="text-[10px] text-gray-500 font-semibold">Listed Oct 29, 2026</div>
                            </div>
                            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                              Listed (Active)
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-gray-800">
                            <span>Remaining: 150 lbs</span>
                            <span>$180 JMD / lb</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-[0.75rem] text-[#333] font-bold mt-4">
              🟢 System Online & Synchronized (PWA Active)
            </div>

            {/* CHANGE CROP MODAL */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                <div className="bg-white w-[90%] max-w-[380px] rounded-xl p-4 shadow-2xl border border-gray-300">
                  <div className="font-black text-base text-[#1b5e20] mb-1">
                    Start New Crop Cycle
                  </div>

                  <p className="text-xs text-[#444] font-medium mb-3">
                    This updates your active field without changing your registered farmer profile.
                  </p>

                  <div className="flex flex-col gap-1 text-xs mb-3">
                    <label className="font-black text-[#111]">Select New Crop:</label>
                    <select
                      value={modalCrop}
                      onChange={(e) => setModalCrop(e.target.value)}
                      className="p-2 border border-gray-400 rounded-md outline-none focus:border-[#1b5e20] bg-white font-semibold text-[#111]"
                    >
                      <option value="Tomato (0.5 Ha)|30%|Jan 15, 2027">Tomato (0.5 Ha)</option>
                      <option value="Cabbage (0.5 Ha)|25%|Dec 20, 2026">Cabbage (0.5 Ha)</option>
                      <option value="Sweet Pepper (0.5 Ha)|35%|Feb 15, 2027">Sweet Pepper (0.5 Ha)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 text-xs mb-3">
                    <label className="font-black text-[#111]">Planting Date:</label>
                    <input
                      type="date"
                      value={modalPlantDate}
                      onChange={(e) => setModalPlantDate(e.target.value)}
                      className="p-2 border border-gray-400 rounded-md outline-none focus:border-[#1b5e20] bg-white font-semibold text-[#111]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-transparent text-[#333] border border-gray-400 px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveNewCrop}
                      className="bg-[#1b5e20] text-white border-none px-3.5 py-1.5 rounded-md text-xs font-black cursor-pointer shadow-sm hover:bg-[#144718]"
                    >
                      Save Crop Cycle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
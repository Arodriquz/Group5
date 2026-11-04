'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'telemetry' | 'market'>('home');
  const [moisture, setMoisture] = useState(34);
  const [isPumpOn, setIsPumpOn] = useState(false);

  // Live Weather Telemetry State
  const [weather, setWeather] = useState({
    location: 'St. Elizabeth, JA',
    temp: '29°C',
    condition: 'Optimal Spraying Weather',
    humidity: '68%',
    wind: '12 km/h',
    rainChance: '15%',
    loading: true,
  });

  // =========================================================================
  // GEOLOCATION & WEATHER FETCHING LOGIC
  // =========================================================================
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_OPENWEATHER_API_KEY`
            );
            if (res.ok) {
              const data = await res.json();
              setWeather({
                location: `${data.name}, JA`,
                temp: `${Math.round(data.main.temp)}°C`,
                condition: data.weather[0].main,
                humidity: `${data.main.humidity}%`,
                wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
                rainChance: '10%',
                loading: false,
              });
            } else {
              setWeather((prev) => ({ ...prev, loading: false }));
            }
          } catch (err) {
            console.error('Weather API fetch failed:', err);
            setWeather((prev) => ({ ...prev, loading: false }));
          }
        },
        () => {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      );
    } else {
      setWeather((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const togglePump = () => {
    setIsPumpOn(!isPumpOn);
    if (!isPumpOn) setMoisture(55);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900 flex flex-col font-sans w-full overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* HEADER / NAVIGATION BAR                                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs w-full">
        <div className="w-full px-6 sm:px-8 h-[120px] flex items-center justify-between gap-6 py-2">
          
          {/* LOGO & TAGLINE SECTION */}
          <div 
            className="flex items-center gap-6 cursor-pointer shrink-0" 
            onClick={() => { setActiveTab('home'); setOpenDropdown(null); }}
          >
            <div className="w-28 h-24 flex items-center justify-center overflow-visible">
              <img 
                src="/images/logo.png" 
                alt="Agri-Connect JA Logo" 
                style={{ 
                  height: '100px', 
                  width: 'auto', 
                  transform: 'scale(1.2)',
                  transformOrigin: 'left center'
                }}
                className="object-contain shrink-0 max-w-none" 
              />
            </div>
            
            <span className="text-base sm:text-lg font-black text-emerald-800 uppercase tracking-wider whitespace-nowrap pl-6">
              Empowering Agriculture, Growing Jamaica
            </span>
          </div>

          {/* MAIN DESKTOP NAVIGATION MENU */}
          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 text-base font-bold text-gray-800 whitespace-nowrap flex-1 px-4">
            
            {/* 1. Farmers Corner Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('farmers')} 
                className="hover:text-emerald-700 flex items-center gap-1.5 py-2 transition-colors cursor-pointer text-base font-extrabold"
              >
                Farmers Corner <span className="text-xs text-gray-400">▼</span>
              </button>
              {openDropdown === 'farmers' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 space-y-1 mt-2 z-50">
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">JA Planting Calendar</div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">Fertilizer & Land Calculator</div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">Ministry & DBJ Grants</div>
                </div>
              )}
            </div>

            {/* 2. Produce Marketplace Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('market')} 
                className="hover:text-emerald-700 flex items-center gap-1.5 py-2 transition-colors cursor-pointer text-base font-extrabold"
              >
                Produce Marketplace <span className="text-xs text-gray-400">▼</span>
              </button>
              {openDropdown === 'market' && (
                <div className="absolute top-full left-0 w-72 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 space-y-1 mt-2 z-50">
                  <button 
                    onClick={() => { setActiveTab('market'); setOpenDropdown(null); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <p className="font-extrabold text-sm text-emerald-950">B2B Produce Market</p>
                    <p className="text-xs text-gray-500 font-normal">Direct hotel & supermarket supply</p>
                  </button>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 cursor-pointer">
                    <p className="font-extrabold text-sm text-emerald-950">Daily Price Index</p>
                    <p className="text-xs text-gray-500 font-normal">Parish & Coronation wholesale prices</p>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 cursor-pointer">
                    <p className="font-extrabold text-sm text-emerald-950">Buyer Sourcing Board</p>
                    <p className="text-xs text-gray-500 font-normal">Commercial bulk purchase requests</p>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 cursor-pointer">
                    <p className="font-extrabold text-sm text-emerald-950">Crop Haulage & Logistics</p>
                    <p className="text-xs text-gray-500 font-normal">Refrigerated islandwide delivery</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Parish Hub Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('parishes')} 
                className="hover:text-emerald-700 flex items-center gap-1.5 py-2 transition-colors cursor-pointer text-base font-extrabold"
              >
                Parish Hub <span className="text-xs text-gray-400">▼</span>
              </button>
              {openDropdown === 'parishes' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 space-y-1 mt-2 z-50">
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">St. Elizabeth & Trelawny</div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">Clarendon & St. Catherine</div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">Portland & St. Mary</div>
                  <div className="p-3 rounded-xl hover:bg-emerald-50 text-sm font-bold text-gray-800 cursor-pointer">RADA Extension Support</div>
                </div>
              )}
            </div>

            {/* 4. About Us Link */}
            <button 
              onClick={() => { setActiveTab('home'); setOpenDropdown(null); }} 
              className="hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap text-base font-extrabold"
            >
              About Us
            </button>

          </nav>

          {/* RIGHT CTA BUTTONS */}
          <div className="flex items-center gap-4 shrink-0">
            <Link className="text-base font-extrabold text-gray-800 hover:text-emerald-700 px-3 py-2 transition-colors cursor-pointer whitespace-nowrap inline-block" href="/login">
              Log In
            </Link>
            <Link className="bg-[#ccff00] hover:bg-[#b8e600] text-emerald-950 font-black text-base px-6 py-3 rounded-xl shadow-xs transition-all hover:scale-105 border border-lime-400 cursor-pointer whitespace-nowrap inline-block" href="/signup">
              Sign Up →
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER AREA                                                       */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full space-y-16 pb-16">
        
        {/* VIEW 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <>
            {/* HERO BANNER SECTION */}
            <section className="bg-[#044c34] text-white w-full py-8 shadow-md">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT COLUMN: HERO HEADING */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
                  <div>
                    <span className="bg-emerald-700/80 text-emerald-200 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-600 inline-block">
                      Empowering 14 Parishes
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
                    Smart Agriculture Built for Jamaican Farmers.
                  </h1>

                  <p className="text-emerald-100 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                    Monitor soil telemetry in real-time, automate field irrigation, and sell produce directly to commercial buyers across Jamaica.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link className="bg-[#ccff00] text-emerald-950 font-black px-7 py-3.5 rounded-xl shadow-md hover:bg-lime-400 transition-all cursor-pointer" href="/farmer-dashboard">
                      Launch Field Control
                    </Link>
                    
                    <Link className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl border border-white/20 transition-all cursor-pointer" href="/buyer-dashboard">
                      Explore Marketplace
                    </Link>
                  </div>
                </div>

                {/* RIGHT COLUMN: HIGH-DENSITY COMPACT CARDS */}
                <div className="lg:col-span-4 flex flex-col gap-2.5 justify-center w-full max-w-sm">
                  
                  {/* COMPACT WEATHER CARD */}
                  <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl backdrop-blur-md space-y-1.5">
                    <div className="flex items-center justify-between border-b border-white/15 pb-1">
                      <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        📍 {weather.location}
                      </span>
                      <span className="text-[10px] bg-[#ccff00] text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Live Feed
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-0.5">
                      <div>
                        <p className="text-3xl font-black text-white leading-none">{weather.temp}</p>
                        <p className="text-xs font-bold text-lime-300 mt-1">{weather.condition}</p>
                      </div>
                      <span className="text-3xl">☀️</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/15 text-xs font-black text-emerald-100">
                      <span className="flex items-center gap-1">💧 {weather.humidity}</span>
                      <span className="flex items-center gap-1">💨 {weather.wind}</span>
                      <span className="flex items-center gap-1">🌧️ {weather.rainChance}</span>
                    </div>
                  </div>

                  {/* COMPACT NATIONAL STATS CARD */}
                  <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl backdrop-blur-md space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-100 font-extrabold">Active Sensors:</span>
                      <span className="font-black text-white text-base">1,240 Devices</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-100 font-extrabold">RADA Verified:</span>
                      <span className="font-black text-white text-base">3,850+ Farmers</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-100 font-extrabold">Trade Volume:</span>
                      <span className="font-black text-[#ccff00] text-base">$14.2M JMD</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SPOKE HUB WITH AGRI-CONNECT JA MOBILE MOCKUP */}
            <section className="max-w-7xl mx-auto px-6 space-y-12 py-6">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                  Integrated Jamaican Telemetry
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-emerald-950">
                  Real-time intelligence across every field, parish, and crop
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  Connect IoT field sensors, local parish weather stations, and commercial B2B buyers directly to your mobile phone.
                </p>
              </div>

              {/* 3-COLUMN SPOKE DIAGRAM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                
                {/* LEFT SPOKE CARDS */}
                <div className="lg:col-span-4 space-y-6">
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-emerald-950">Understand your soil</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Real-Time Soil Telemetry</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Make smarter irrigation decisions with real-time moisture, pH, and NPK temperature probes.
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-emerald-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-emerald-950">Parish microclimates</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Local Weather Feed</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Improve spraying accuracy and time fertilizer application with parish-level advisories.
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-sky-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-emerald-950">Automated drip valves</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Remote Water Control</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Trigger automated drip irrigation valves remotely to conserve water and cut labor costs.
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-blue-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                  </div>

                </div>

                {/* CENTER HUB: MOBILE MOCKUP */}
                <div className="lg:col-span-4 flex justify-center py-4">
                  <div className="w-[300px] bg-[#022c1e] p-5 rounded-[40px] border-4 border-[#011e14] shadow-2xl space-y-4 text-white">
                    <div className="w-24 h-3.5 bg-[#044c34] mx-auto rounded-full"></div>
                    
                    <div className="bg-[#033b28] border border-[#065e41] p-4 rounded-3xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-[#ccff00] flex items-center gap-1">📍 ST. ELIZABETH BLOCK #4</span>
                        <span className="text-[#ccff00] uppercase text-[10px]">LIVE</span>
                      </div>

                      <div className="bg-[#022c1e] border border-[#044c34] rounded-2xl p-4 text-center space-y-1">
                        <div className="text-3xl my-1">🗺️</div>
                        <p className="font-black text-sm text-white">Sweet Pepper Soil Map</p>
                        <p className="text-[11px] font-extrabold text-[#22c55e]">Moisture Index: 34% (Optimal)</p>
                      </div>
                    </div>

                    <div className="bg-[#033b28] border border-[#065e41] px-4 py-3 rounded-2xl flex justify-between items-center text-sm font-extrabold">
                      <span className="text-white">Drip Valve Status</span>
                      <span className="bg-[#ccff00] text-emerald-950 text-xs font-black px-2.5 py-1 rounded-md uppercase">READY</span>
                    </div>

                    <div className="bg-[#033b28] border border-[#065e41] px-4 py-3 rounded-2xl flex justify-between items-center text-sm font-extrabold">
                      <span className="text-white">Market Offer</span>
                      <span className="text-[#ccff00] font-black text-base">$380 JMD / lb</span>
                    </div>

                    <Link className="block text-center w-full bg-[#ccff00] hover:bg-lime-400 text-emerald-950 font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md" href="/farmer-dashboard">
                      Open Live Control →
                    </Link>

                  </div>
                </div>

                {/* RIGHT SPOKE CARDS */}
                <div className="lg:col-span-4 space-y-6">
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="w-20 h-20 bg-amber-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                    <div className="space-y-1 text-right">
                      <h3 className="font-black text-base text-emerald-950">Direct B2B Market</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Wholesale Sourcing</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Connect harvested yields directly to hotel procurement desks and supermarkets islandwide.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="w-20 h-20 bg-purple-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                    <div className="space-y-1 text-right">
                      <h3 className="font-black text-base text-emerald-950">RADA Verified Identity</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Farmer Trust Score</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Build instant commercial buyer confidence with verified registration status across 14 parishes.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-all">
                    <div className="w-20 h-20 bg-emerald-100 rounded-xl shrink-0 flex items-center justify-center text-3xl"> </div>
                    <div className="space-y-1 text-right">
                      <h3 className="font-black text-base text-emerald-950">Crop Haulage Logistics</h3>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Refrigerated Transit</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Book refrigerated crop transport to ship freshly picked harvests directly from parish to market.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* PROCESS FLOW */}
            <section className="max-w-7xl mx-auto px-6 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Getting Started</span>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">How Agri-Connect JA Works</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs relative">
                  <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">01</span>
                  <h3 className="font-black text-base text-emerald-950 mt-2">Deploy Sensors</h3>
                  <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                    Insert your soil probe into your active crop block and pair it with your local cellular or Wi-Fi gateway.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs relative">
                  <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">02</span>
                  <h3 className="font-black text-base text-emerald-950 mt-2">Set Rules & Automate</h3>
                  <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                    Configure custom moisture levels to receive notifications or auto-toggle irrigation drip valves remotely.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs relative">
                  <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">03</span>
                  <h3 className="font-black text-base text-emerald-950 mt-2">List & Trade Yields</h3>
                  <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                    Post your upcoming crop harvests on the marketplace to secure purchase commitments before picking.
                  </p>
                </div>
              </div>
            </section>

            {/* TRUST BANNER */}
            <section className="bg-emerald-50 border-y border-emerald-200 w-full py-8">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1 max-w-2xl">
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                    Islandwide Integration
                  </span>
                  <h3 className="text-lg font-black text-emerald-950">Verified Agriculture Across All 14 Parishes</h3>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Connecting smallholders in St. Elizabeth, Clarendon, and Trelawny with commercial distribution networks islandwide.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <span className="bg-white border border-emerald-200 text-emerald-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs">
                    14 Parishes Covered
                  </span>
                  <span className="bg-white border border-emerald-200 text-emerald-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs">
                    RADA Data Ready
                  </span>
                </div>
              </div>
            </section>

            {/* MARKETPLACE TEASER */}
            <section className="max-w-7xl mx-auto px-6 space-y-6">
              <div className="flex justify-between items-end border-b border-gray-200 pb-3">
                <div>
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Market Demand</span>
                  <h2 className="text-2xl font-black text-emerald-950">Trending Produce Sourcing</h2>
                </div>
                <Link className="text-xs font-black text-emerald-700 hover:underline" href="/buyer-dashboard">
                  View Full Marketplace →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">St. Ann Supplier</span>
                  <h3 className="font-black text-base text-gray-900">Yellow Yam (Grade A)</h3>
                  <p className="text-xs text-gray-500 font-medium">Quantity: 2,500 lbs available</p>
                  <div className="flex justify-between items-center text-xs font-black border-t pt-3">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-emerald-700 text-sm">$195 JMD / lb</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">St. Elizabeth Supplier</span>
                  <h3 className="font-black text-base text-gray-900">Scotch Bonnet Peppers</h3>
                  <p className="text-xs text-gray-500 font-medium">Quantity: 800 lbs available</p>
                  <div className="flex justify-between items-center text-xs font-black border-t pt-3">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-emerald-700 text-sm">$380 JMD / lb</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">Manchester Supplier</span>
                  <h3 className="font-black text-base text-gray-900">Irish Potato (Grade A)</h3>
                  <p className="text-xs text-gray-500 font-medium">Quantity: 5,000 lbs available</p>
                  <div className="flex justify-between items-center text-xs font-black border-t pt-3">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-emerald-700 text-sm">$210 JMD / lb</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-emerald-950 text-white border-t border-emerald-900 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs font-bold gap-4">
          <span>© 2026 Agri-Connect JA. All Rights Reserved.</span>
          <div className="flex gap-6 text-emerald-200">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">RADA Verification</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
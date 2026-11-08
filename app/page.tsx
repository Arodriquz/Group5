'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './home.css';
import { useWeather } from './useWeather';
import { useTheme } from './useTheme';

export default function HomePage() {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'telemetry' | 'market'>('home');
  const [moisture, setMoisture] = useState(34);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [showPestModal, setShowPestModal] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const toggleMobileSection = (section: string) => {
    setMobileSection(mobileSection === section ? null : section);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  // Tracks whether the page has been scrolled
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Weather logic lives in useWeather.ts
  const weather = useWeather();

  // Light/dark mode logic lives in useTheme.ts
  const { theme, toggleTheme } = useTheme();

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const togglePump = () => {
    setIsPumpOn(!isPumpOn);
    if (!isPumpOn) setMoisture(55);
  };

  return (
    <div className={`page ${theme === 'dark' ? 'dark-theme' : ''}`}>

      {/* ========================================================================= */}
      {/* PEST ADVISORY MODAL                                                       */}
      {/* ========================================================================= */}
      {showPestModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 relative border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setShowPestModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              RADA National Alert
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Beet Armyworm Advisory</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Increased pest activity reported in dry South St. Elizabeth scallion and onion fields. Farmers are advised to initiate localized moisture monitoring and approved organic spraying cycles.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowPestModal(false)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER / NAVIGATION BAR                                                   */}
      {/* ========================================================================= */}
      <header className={`header ${scrolled || mobileOpen || activeTab !== 'home' ? 'header-scrolled' : ''}`}>
        <div className="header-inner">

          {/* LOGO & TAGLINE SECTION */}
          <div
            className="brand"
            onClick={() => { setActiveTab('home'); setOpenDropdown(null); }}
          >
            <div className="brand-logo-box">
              <img
                src="/images/logo.png"
                alt="Agri-Connect JA Logo"
                className="brand-logo"
              />
            </div>

            <span className="brand-tagline">
              Empowering Agriculture, Growing Jamaica
            </span>
          </div>

          {/* MAIN DESKTOP NAVIGATION MENU */}
          <nav className="main-nav">

            {/* 1. Farmers Corner Dropdown */}
            <div className="nav-item">
              <button onClick={() => toggleDropdown('farmers')} className="nav-button">
                Farmers Corner <span className="nav-arrow">▼</span>
              </button>
              {openDropdown === 'farmers' && (
                <div className="dropdown">
                  <a href="https://moa.gov.jm" target="_blank" rel="noreferrer" className="dropdown-link">
                    <div>MOAF / RADA Portal</div>
                    <span className="text-[10px] opacity-75">National Extension Services</span>
                  </a>
                  <button onClick={() => { setShowPestModal(true); setOpenDropdown(null); }} className="dropdown-link text-left w-full">
                    <div>Pest & Disease Advisory</div>
                    <span className="text-[10px] opacity-75">Beet Armyworm & Leaf Curl Alerts</span>
                  </button>
                  <Link href="/farmer-dashboard" className="dropdown-link">
                    <div>JA Planting Calendar</div>
                    <span className="text-[10px] opacity-75">Seasonal crop rotation benchmarks</span>
                  </Link>
                  <a href="https://dbankjm.com" target="_blank" rel="noreferrer" className="dropdown-link">
                    <div>Ministry & DBJ Grants</div>
                    <span className="text-[10px] opacity-75">Development Bank funding access</span>
                  </a>
                </div>
              )}
            </div>

            {/* 2. Produce Marketplace Dropdown */}
            <div className="nav-item">
              <button onClick={() => toggleDropdown('market')} className="nav-button">
                Produce Marketplace <span className="nav-arrow">▼</span>
              </button>
              {openDropdown === 'market' && (
                <div className="dropdown dropdown-wide">
                  <button
                    onClick={() => { setActiveTab('market'); setOpenDropdown(null); }}
                    className="dropdown-rich"
                  >
                    <p className="dropdown-rich-title">Browse Live Listings</p>
                    <p className="dropdown-rich-desc">Grade A Yam, Peppers, Irish Potato</p>
                  </button>
                  <Link href="/farmer-dashboard" className="dropdown-rich">
                    <p className="dropdown-rich-title">Post Harvest Yield</p>
                    <p className="dropdown-rich-desc">List upcoming crop yields early</p>
                  </Link>
                  <div className="dropdown-rich">
                    <p className="dropdown-rich-title">Daily Price Index</p>
                    <p className="dropdown-rich-desc">Parish & Coronation wholesale prices</p>
                  </div>
                  <div className="dropdown-rich">
                    <p className="dropdown-rich-title">Buyer Sourcing Board</p>
                    <p className="dropdown-rich-desc">Commercial bulk purchase requests</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Parish Hub Dropdown */}
            <div className="nav-item">
              <button onClick={() => toggleDropdown('parishes')} className="nav-button">
                Parish Hub <span className="nav-arrow">▼</span>
              </button>
              {openDropdown === 'parishes' && (
                <div className="dropdown">
                  <div className="dropdown-link">St. Elizabeth & Trelawny</div>
                  <div className="dropdown-link">Clarendon & St. Catherine</div>
                  <div className="dropdown-link">Portland & St. Mary</div>
                  <div className="dropdown-link">RADA Extension Support</div>
                </div>
              )}
            </div>

            {/* 4. About Us Link */}
            <button
              onClick={() => { setActiveTab('home'); setOpenDropdown(null); }}
              className="nav-link"
            >
              About Us
            </button>

          </nav>

          {/* RIGHT CTA BUTTONS */}
          <div className="header-actions">
            <Link className="login-link" href="/login">
              <span className="login-icon" aria-hidden="true"></span>
              Log In
            </Link>
            <Link className="signup-button" href="/signup">
              Sign Up
            </Link>

            {/* LIGHT / DARK MODE TOGGLE */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              className="hamburger"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>

        {mobileOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">

            {/* Farmers Corner */}
            <button className="mobile-group-button" onClick={() => toggleMobileSection('farmers')}>
              Farmers Corner <span className="nav-arrow">{mobileSection === 'farmers' ? '▲' : '▼'}</span>
            </button>
            {mobileSection === 'farmers' && (
              <div className="mobile-sublist">
                <a href="https://moa.gov.jm" target="_blank" rel="noreferrer" className="mobile-sublink">MOAF / RADA Portal</a>
                <button onClick={() => { setShowPestModal(true); closeMobile(); }} className="mobile-sublink text-left">Pest Advisory</button>
                <div className="mobile-sublink">JA Planting Calendar</div>
                <div className="mobile-sublink">Ministry & DBJ Grants</div>
              </div>
            )}

            {/* Produce Marketplace */}
            <button className="mobile-group-button" onClick={() => toggleMobileSection('market')}>
              Produce Marketplace <span className="nav-arrow">{mobileSection === 'market' ? '▲' : '▼'}</span>
            </button>
            {mobileSection === 'market' && (
              <div className="mobile-sublist">
                <button
                  className="mobile-sublink"
                  onClick={() => { setActiveTab('market'); closeMobile(); }}
                >
                  Browse Live Listings
                  <span className="mobile-sublink-desc">Grade A Yam, Peppers, Irish Potato</span>
                </button>
                <div className="mobile-sublink">
                  Daily Price Index
                  <span className="mobile-sublink-desc">Parish & Coronation wholesale prices</span>
                </div>
                <div className="mobile-sublink">
                  Buyer Sourcing Board
                  <span className="mobile-sublink-desc">Commercial bulk purchase requests</span>
                </div>
              </div>
            )}

            {/* Parish Hub */}
            <button className="mobile-group-button" onClick={() => toggleMobileSection('parishes')}>
              Parish Hub <span className="nav-arrow">{mobileSection === 'parishes' ? '▲' : '▼'}</span>
            </button>
            {mobileSection === 'parishes' && (
              <div className="mobile-sublist">
                <div className="mobile-sublink">St. Elizabeth & Trelawny</div>
                <div className="mobile-sublink">Clarendon & St. Catherine</div>
                <div className="mobile-sublink">Portland & St. Mary</div>
                <div className="mobile-sublink">RADA Extension Support</div>
              </div>
            )}

            {/* About Us */}
            <button
              className="mobile-group-button"
              onClick={() => { setActiveTab('home'); closeMobile(); }}
            >
              About Us
            </button>

            {/* Log In */}
            <Link className="mobile-login" href="/login" onClick={closeMobile}>
              Log In
            </Link>

          </nav>
        )}
        
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER AREA                                                       */}
      {/* ========================================================================= */}
      <main className="main">

        {/* VIEW 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <>
            {/* HERO BANNER SECTION */}
            <section className="hero">
              <div className="hero-inner">

                {/* LEFT COLUMN: HERO HEADING */}
                <div className="hero-left">
                  <div>
                    <span className="hero-badge">Empowering 14 Parishes</span>
                  </div>

                  <h1 className="hero-title">
                    Smart Agriculture Built for Jamaican Farmers.
                  </h1>

                  <p className="hero-subtitle">
                    Monitor soil telemetry in real-time, automate field irrigation, and sell produce directly to commercial buyers across Jamaica.
                  </p>

                  <div className="hero-actions">
                    <Link className="btn-primary" href="/login">
                      Launch Field Control
                    </Link>

                    <Link className="btn-secondary" href="/buyer-dashboard">
                      Explore Marketplace
                    </Link>
                  </div>
                </div>

                {/* RIGHT COLUMN: HIGH-DENSITY COMPACT CARDS */}
                <div className="hero-right">

                  {/* COMPACT WEATHER CARD */}
                  <div className="glass-card">
                    <div className="weather-header">
                      <span className="weather-location">📍 {weather?.location || "St. Elizabeth"}</span>
                      <span className="live-badge">Live Feed</span>
                    </div>

                    <div className="weather-main">
                      <div>
                        <p className="weather-temp">{weather?.temp || "30°C"}</p>
                        <p className="weather-condition">{weather?.condition || "Mostly Sunny"}</p>
                      </div>
                      <span className="weather-icon">☀️</span>
                    </div>

                    <div className="weather-stats">
                      <span className="weather-stat">💧 {weather?.humidity || "72%"}</span>
                      <span className="weather-stat">💨 {weather?.wind || "14 km/h"}</span>
                      <span className="weather-stat">🌧️ {weather?.rainChance || "10%"}</span>
                    </div>
                  </div>

                  {/* COMPACT NATIONAL STATS CARD */}
                  <div className="glass-card">
                    <div className="stat-row">
                      <span className="stat-label">Active Sensors:</span>
                      <span className="stat-value">1,240 Devices</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">RADA Verified:</span>
                      <span className="stat-value">3,850+ Farmers</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Trade Volume:</span>
                      <span className="stat-value-accent">$14.2M JMD</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SPOKE HUB WITH AGRI-CONNECT JA MOBILE MOCKUP */}
            <section className="section-spoke">
              <div className="section-heading-center">
                <span className="eyebrow">Integrated Jamaican Telemetry</span>
                <h2 className="section-title-lg">
                  Real-time intelligence across every field, parish, and crop
                </h2>
                <p className="section-intro">
                  Connect IoT field sensors, local parish weather stations, and commercial B2B buyers directly to your mobile phone.
                </p>
              </div>

              {/* 3-COLUMN SPOKE DIAGRAM */}
              <div className="spoke-grid">

                {/* LEFT SPOKE CARDS */}
                <div className="spoke-column">

                  <div className="spoke-card">
                    <div className="spoke-text">
                      <h3 className="spoke-title">Understand your soil</h3>
                      <p className="spoke-tag">Real-Time Soil Telemetry</p>
                      <p className="spoke-desc">
                        Make smarter irrigation decisions with real-time moisture, pH, and NPK temperature probes.
                      </p>
                    </div>
                    <div className="spoke-icon icon-emerald"> </div>
                  </div>

                  <div className="spoke-card">
                    <div className="spoke-text">
                      <h3 className="spoke-title">Parish microclimates</h3>
                      <p className="spoke-tag">Local Weather Feed</p>
                      <p className="spoke-desc">
                        Improve spraying accuracy and time fertilizer application with parish-level advisories.
                      </p>
                    </div>
                    <div className="spoke-icon icon-sky"> </div>
                  </div>

                  <div className="spoke-card">
                    <div className="spoke-text">
                      <h3 className="spoke-title">Automated drip valves</h3>
                      <p className="spoke-tag">Remote Water Control</p>
                      <p className="spoke-desc">
                        Trigger automated drip irrigation valves remotely to conserve water and cut labor costs.
                      </p>
                    </div>
                    <div className="spoke-icon icon-blue"> </div>
                  </div>

                </div>

                {/* CENTER HUB: MOBILE MOCKUP */}
                <div className="phone-wrap">
                  <div className="phone">
                    <div className="phone-notch"></div>

                    <div className="phone-panel">
                      <div className="phone-panel-header">
                        <span className="phone-block-name"> ST. ELIZABETH BLOCK #4</span>
                        <span className="phone-live">LIVE</span>
                      </div>

                      <div className="phone-map">
                        <div className="phone-map-icon"></div>
                        <p className="phone-map-title">Sweet Pepper Soil Map</p>
                        <p className="phone-map-status">Moisture Index: {moisture}% ({moisture > 40 ? "Saturated" : "Optimal"})</p>
                      </div>
                    </div>

                    <div className="phone-row">
                      <span className="phone-row-label">Drip Valve Status</span>
                      <button onClick={togglePump} className="phone-ready-badge cursor-pointer hover:opacity-80">
                        {isPumpOn ? "PUMP ACTIVE" : "READY"}
                      </button>
                    </div>

                    <div className="phone-row">
                      <span className="phone-row-label">Market Offer</span>
                      <span className="phone-price">$380 JMD / lb</span>
                    </div>

                    <Link className="phone-cta" href="/login">
                      Open Live Control →
                    </Link>

                  </div>
                </div>

                {/* RIGHT SPOKE CARDS */}
                <div className="spoke-column">

                  <div className="spoke-card">
                    <div className="spoke-icon icon-amber"> </div>
                    <div className="spoke-text-right">
                      <h3 className="spoke-title">Direct B2B Market</h3>
                      <p className="spoke-tag">Wholesale Sourcing</p>
                      <p className="spoke-desc">
                        Connect harvested yields directly to hotel procurement desks and supermarkets islandwide.
                      </p>
                    </div>
                  </div>

                  <div className="spoke-card">
                    <div className="spoke-icon icon-purple"> </div>
                    <div className="spoke-text-right">
                      <h3 className="spoke-title">RADA Verified Identity</h3>
                      <p className="spoke-tag">Farmer Trust Score</p>
                      <p className="spoke-desc">
                        Build instant commercial buyer confidence with verified registration status across 14 parishes.
                      </p>
                    </div>
                  </div>

                  <div className="spoke-card">
                    <div className="spoke-icon icon-emerald"> </div>
                    <div className="spoke-text-right">
                      <h3 className="spoke-title">Crop Haulage Logistics</h3>
                      <p className="spoke-tag">Refrigerated Transit</p>
                      <p className="spoke-desc">
                        Book refrigerated crop transport to ship freshly picked harvests directly from parish to market.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* PROCESS FLOW WITH TROPICAL JAMAICAN IMAGES */}
            <section className="section pt-6 pb-4">
              <div className="section-heading-small text-center mb-4">
                <span className="eyebrow-tight text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                  Getting Started
                </span>
                <h2 className="section-title text-2xl font-bold text-slate-900 mt-1">
                  How Agri-Connect JA Works
                </h2>
              </div>

              <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-6">
                {/* STEP 01 */}
                <div className="step-card bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="step-number text-2xl font-extrabold text-emerald-600">01</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">In-Field Hardware</span>
                    </div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3 border border-slate-100">
                      <img 
                        src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80" 
                        alt="Smart Telemetry Sensor Probe in Soil" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="step-title text-base font-bold text-slate-900">Deploy Field Probes</h3>
                    <p className="step-desc text-xs text-slate-600 mt-1 leading-relaxed">
                      Insert wireless soil probes into active crop plots across parish farmlands to monitor real-time soil moisture and pH.
                    </p>
                  </div>
                </div>

                {/* STEP 02 */}
                <div className="step-card bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="step-number text-2xl font-extrabold text-emerald-600">02</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Automated Telemetry</span>
                    </div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3 border border-slate-100">
                      <img 
                        src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80" 
                        alt="Farmer checking field telemetry on phone" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="step-title text-base font-bold text-slate-900">Set Rules & Automate</h3>
                    <p className="step-desc text-xs text-slate-600 mt-1 leading-relaxed">
                      Configure custom moisture thresholds to trigger automated drip irrigation valves when soil moisture dips below target levels.
                    </p>
                  </div>
                </div>

                {/* STEP 03 */}
                <div className="step-card bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="step-number text-2xl font-extrabold text-emerald-600">03</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">B2B Trade</span>
                    </div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3 border border-slate-100">
                      <img 
                        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80" 
                        alt="Fresh Market Produce Crates" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="step-title text-base font-bold text-slate-900">List & Trade Yields</h3>
                    <p className="step-desc text-xs text-slate-600 mt-1 leading-relaxed">
                      Post harvested yields directly to the marketplace to secure supply contracts with resort kitchens and grocers before picking.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST BANNER */}
            <section className="trust bg-emerald-950 text-white py-5 my-2 border-y border-emerald-800/40">
              <div className="trust-inner max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="trust-text max-w-2xl">
                  <span className="trust-badge bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Islandwide Telemetry
                  </span>
                  <h3 className="trust-title text-xl font-bold mt-1">
                    Verified Agriculture Across All 14 Parishes
                  </h3>
                  <p className="trust-desc text-xs text-emerald-200 mt-0.5">
                    Connecting smallholders in St. Elizabeth, Manchester, Clarendon, and Trelawny directly to commercial procurement networks islandwide.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <div className="bg-emerald-900/80 border border-emerald-700/50 rounded-xl px-3.5 py-1.5 text-center">
                    <span className="block text-base font-extrabold text-white">14</span>
                    <span className="text-[9px] uppercase text-emerald-300 font-semibold">Parishes Live</span>
                  </div>
                  <div className="bg-emerald-900/80 border border-emerald-700/50 rounded-xl px-3.5 py-1.5 text-center">
                    <span className="block text-base font-extrabold text-white">RADA</span>
                    <span className="text-[9px] uppercase text-emerald-300 font-semibold">Verified Data</span>
                  </div>
                  <div className="bg-emerald-900/80 border border-emerald-700/50 rounded-xl px-3.5 py-1.5 text-center">
                    <span className="block text-base font-extrabold text-white">DBJ</span>
                    <span className="text-[9px] uppercase text-emerald-300 font-semibold">Grant Ready</span>
                  </div>
                </div>
              </div>
            </section>

            {/* MARKETPLACE TEASER */}
            <section className="section pt-4 pb-8 max-w-7xl mx-auto px-6">
              <div className="teaser-header flex justify-between items-end mb-4">
                <div>
                  <span className="eyebrow-tight text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                    Market Demand
                  </span>
                  <h2 className="teaser-title text-2xl font-bold text-slate-900 mt-1">
                    Trending Produce Sourcing
                  </h2>
                </div>
                <Link className="teaser-link text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors" href="/buyer-dashboard">
                  View Full Marketplace →
                </Link>
              </div>

              <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* PRODUCE CARD 1: YELLOW YAM */}
                <div className="listing-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-36 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=600&q=80" 
                      alt="Fresh Root Yam Harvest" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      St. Ann Supplier
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="listing-name font-bold text-slate-900 text-base">Yellow Yam (Grade A)</h3>
                      <p className="listing-qty text-xs text-slate-500 mt-0.5">Quantity: 2,500 lbs available</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-semibold">Wholesale Price</span>
                        <span className="listing-price font-extrabold text-emerald-700 text-sm">$195 JMD / lb</span>
                      </div>
                      <Link 
                        href="/buyer-dashboard"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Request Bulk →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* PRODUCE CARD 2: SCOTCH BONNET */}
                <div className="listing-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-36 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80" 
                      alt="Fresh Scotch Bonnet Peppers" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      St. Elizabeth Supplier
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="listing-name font-bold text-slate-900 text-base">Scotch Bonnet Peppers</h3>
                      <p className="listing-qty text-xs text-slate-500 mt-0.5">Quantity: 800 lbs available</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-semibold">Wholesale Price</span>
                        <span className="listing-price font-extrabold text-emerald-700 text-sm">$380 JMD / lb</span>
                      </div>
                      <Link 
                        href="/buyer-dashboard"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Request Bulk →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* PRODUCE CARD 3: IRISH POTATO */}
                <div className="listing-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-36 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80" 
                      alt="Fresh Harvested Potatoes" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      Manchester Supplier
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="listing-name font-bold text-slate-900 text-base">Irish Potato (Grade A)</h3>
                      <p className="listing-qty text-xs text-slate-500 mt-0.5">Quantity: 5,000 lbs available</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-semibold">Wholesale Price</span>
                        <span className="listing-price font-extrabold text-emerald-700 text-sm">$210 JMD / lb</span>
                      </div>
                      <Link 
                        href="/buyer-dashboard"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Request Bulk →
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 Agri-Connect JA. All Rights Reserved.</span>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">RADA Verification</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const toggleMobileSection = (section: string) => {
    setMobileSection(mobileSection === section ? null : section);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  //Tracks whether the page has been scrolled (for the transparent header)
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
    <div className="page">

      {/* ========================================================================= */}
      {/* HEADER / NAVIGATION BAR                                                   */}
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
                  <div className="dropdown-link">JA Planting Calendar</div>
                  <div className="dropdown-link">Fertilizer & Land Calculator</div>
                  <div className="dropdown-link">Ministry & DBJ Grants</div>
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
                    <p className="dropdown-rich-title">B2B Produce Market</p>
                    <p className="dropdown-rich-desc">Direct hotel & supermarket supply</p>
                  </button>
                  <div className="dropdown-rich">
                    <p className="dropdown-rich-title">Daily Price Index</p>
                    <p className="dropdown-rich-desc">Parish & Coronation wholesale prices</p>
                  </div>
                  <div className="dropdown-rich">
                    <p className="dropdown-rich-title">Buyer Sourcing Board</p>
                    <p className="dropdown-rich-desc">Commercial bulk purchase requests</p>
                  </div>
                  <div className="dropdown-rich">
                    <p className="dropdown-rich-title">Crop Haulage & Logistics</p>
                    <p className="dropdown-rich-desc">Refrigerated islandwide delivery</p>
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
                <div className="mobile-sublink">JA Planting Calendar</div>
                <div className="mobile-sublink">Fertilizer & Land Calculator</div>
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
                  B2B Produce Market
                  <span className="mobile-sublink-desc">Direct hotel & supermarket supply</span>
                </button>
                <div className="mobile-sublink">
                  Daily Price Index
                  <span className="mobile-sublink-desc">Parish & Coronation wholesale prices</span>
                </div>
                <div className="mobile-sublink">
                  Buyer Sourcing Board
                  <span className="mobile-sublink-desc">Commercial bulk purchase requests</span>
                </div>
                <div className="mobile-sublink">
                  Crop Haulage & Logistics
                  <span className="mobile-sublink-desc">Refrigerated islandwide delivery</span>
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

            {/* Log In only appears here on very small screens */}
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
                      <span className="weather-location">📍 {weather.location}</span>
                      <span className="live-badge">Live Feed</span>
                    </div>

                    <div className="weather-main">
                      <div>
                        <p className="weather-temp">{weather.temp}</p>
                        <p className="weather-condition">{weather.condition}</p>
                      </div>
                      <span className="weather-icon">☀️</span>
                    </div>

                    <div className="weather-stats">
                      <span className="weather-stat">💧 {weather.humidity}</span>
                      <span className="weather-stat">💨 {weather.wind}</span>
                      <span className="weather-stat">🌧️ {weather.rainChance}</span>
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
                        <p className="phone-map-status">Moisture Index: 34% (Optimal)</p>
                      </div>
                    </div>

                    <div className="phone-row">
                      <span className="phone-row-label">Drip Valve Status</span>
                      <span className="phone-ready-badge">READY</span>
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

            {/* PROCESS FLOW */}
            <section className="section">
              <div className="section-heading-small">
                <span className="eyebrow-tight">Getting Started</span>
                <h2 className="section-title">How Agri-Connect JA Works</h2>
              </div>

              <div className="steps-grid">
                <div className="step-card">
                  <span className="step-number">01</span>
                  <h3 className="step-title">Deploy Sensors</h3>
                  <p className="step-desc">
                    Insert your soil probe into your active crop block and pair it with your local cellular or Wi-Fi gateway.
                  </p>
                </div>

                <div className="step-card">
                  <span className="step-number">02</span>
                  <h3 className="step-title">Set Rules & Automate</h3>
                  <p className="step-desc">
                    Configure custom moisture levels to receive notifications or auto-toggle irrigation drip valves remotely.
                  </p>
                </div>

                <div className="step-card">
                  <span className="step-number">03</span>
                  <h3 className="step-title">List & Trade Yields</h3>
                  <p className="step-desc">
                    Post your upcoming crop harvests on the marketplace to secure purchase commitments before picking.
                  </p>
                </div>
              </div>
            </section>

            {/* TRUST BANNER */}
            <section className="trust">
              <div className="trust-inner">
                <div className="trust-text">
                  <span className="trust-badge">Islandwide Integration</span>
                  <h3 className="trust-title">Verified Agriculture Across All 14 Parishes</h3>
                  <p className="trust-desc">
                    Connecting smallholders in St. Elizabeth, Clarendon, and Trelawny with commercial distribution networks islandwide.
                  </p>
                </div>
                <div className="trust-pills">
                  <span className="trust-pill">14 Parishes Covered</span>
                  <span className="trust-pill">RADA Data Ready</span>
                </div>
              </div>
            </section>

            {/* MARKETPLACE TEASER */}
            <section className="section">
              <div className="teaser-header">
                <div>
                  <span className="eyebrow-tight">Market Demand</span>
                  <h2 className="teaser-title">Trending Produce Sourcing</h2>
                </div>
                <Link className="teaser-link" href="/buyer-dashboard">
                  View Full Marketplace →
                </Link>
              </div>

              <div className="steps-grid">
                <div className="listing-card">
                  <span className="listing-badge">St. Ann Supplier</span>
                  <h3 className="listing-name">Yellow Yam (Grade A)</h3>
                  <p className="listing-qty">Quantity: 2,500 lbs available</p>
                  <div className="listing-price-row">
                    <span className="listing-price-label">Price:</span>
                    <span className="listing-price">$195 JMD / lb</span>
                  </div>
                </div>

                <div className="listing-card">
                  <span className="listing-badge">St. Elizabeth Supplier</span>
                  <h3 className="listing-name">Scotch Bonnet Peppers</h3>
                  <p className="listing-qty">Quantity: 800 lbs available</p>
                  <div className="listing-price-row">
                    <span className="listing-price-label">Price:</span>
                    <span className="listing-price">$380 JMD / lb</span>
                  </div>
                </div>

                <div className="listing-card">
                  <span className="listing-badge">Manchester Supplier</span>
                  <h3 className="listing-name">Irish Potato (Grade A)</h3>
                  <p className="listing-qty">Quantity: 5,000 lbs available</p>
                  <div className="listing-price-row">
                    <span className="listing-price-label">Price:</span>
                    <span className="listing-price">$210 JMD / lb</span>
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

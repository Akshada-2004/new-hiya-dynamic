"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Search,
  Shield,
  Clock3,
  Star,
  TrendingUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SERVICE_OPTIONS } from "@/app/services/service-catalog";

export default function ServiceFinder() {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [loading, setLoading] = useState({
    countries: true,
    states: false,
    cities: false,
  });

  useEffect(() => {
    fetch("/api/locations/countries")
      .then((r) => r.json())
      .then((data) => {
        setCountries(Array.isArray(data) ? data : []);
        setLoading((l) => ({ ...l, countries: false }));
      })
      .catch(() => setLoading((l) => ({ ...l, countries: false })));
  }, []);

  function handleCountryChange(e) {
    const id = e.target.value;
    const country = countries.find((c) => String(c.id) === id) ?? null;
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    if (!country) return;
    setLoading((l) => ({ ...l, states: true }));
    fetch(`/api/locations/states?countryId=${country.id}`)
      .then((r) => r.json())
      .then((data) => {
        setStates(Array.isArray(data) ? data : []);
        setLoading((l) => ({ ...l, states: false }));
      })
      .catch(() => setLoading((l) => ({ ...l, states: false })));
  }

  function handleStateChange(e) {
    const id = e.target.value;
    const state = states.find((s) => String(s.id) === id) ?? null;
    setSelectedState(state);
    setSelectedCity(null);
    setCities([]);
    if (!state) return;
    setLoading((l) => ({ ...l, cities: true }));
    fetch(`/api/locations/cities?stateId=${state.id}`)
      .then((r) => r.json())
      .then((data) => {
        setCities(Array.isArray(data) ? data : []);
        setLoading((l) => ({ ...l, cities: false }));
      })
      .catch(() => setLoading((l) => ({ ...l, cities: false })));
  }

  function handleCityChange(e) {
    const id = e.target.value;
    const city = cities.find((c) => String(c.id) === id) ?? null;
    setSelectedCity(city);
  }

  function handleServiceChange(e) {
    const id = e.target.value;
    const service = SERVICE_OPTIONS.find((s) => s.id === id) ?? null;
    setSelectedService(service);
  }

  function handleSubmit() {
    if (!selectedService || !selectedCountry) return;
    const svc = selectedService.id;
    const cSlug = selectedCountry.slug;
    if (selectedState && selectedCity) {
      router.push(`/${cSlug}-${svc}-in-${selectedCity.slug}`);
    } else if (selectedState) {
      router.push(`/${cSlug}-${svc}-in-${selectedState.slug}`);
    } else {
      router.push(`/${svc}-in-${cSlug}`);
    }
  }

  const canSubmit = Boolean(selectedService && selectedCountry);

  const buttonLabel =
    selectedService && selectedCountry && selectedState && selectedCity
      ? `${selectedService.shortName} in ${selectedCity.name}`
      : selectedService && selectedCountry && selectedState
      ? `${selectedService.shortName} in ${selectedState.name}`
      : selectedService && selectedCountry
      ? `${selectedService.shortName} in ${selectedCountry.name}`
      : "Select a Location";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sf-section {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(145deg, #0a0f1e 0%, #0f1729 40%, #0e1520 100%);
          position: relative;
          overflow: hidden;
          padding: 100px 0 110px;
        }

        /* Ambient glow orbs */
        .sf-section::before {
          content: '';
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(202,32,47,0.12) 0%, transparent 70%);
          top: -200px;
          right: -150px;
          pointer-events: none;
        }
        .sf-section::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,130,255,0.08) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }

        /* Subtle grid texture */
        .sf-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .sf-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          position: relative;
          z-index: 1;
        }

        /* Badge */
        .sf-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 100px;
          border: 1px solid rgba(202,32,47,0.35);
          background: rgba(202,32,47,0.08);
          color: #f4737d;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          margin-bottom: 28px;
        }

        /* Heading */
        .sf-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 700;
          color: #f0f2f8;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .sf-heading em {
          font-style: italic;
          color: #ca202f;
          background: linear-gradient(135deg, #e84055, #ca202f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sf-subheading {
          margin-top: 20px;
          font-size: 17px;
          color: rgba(180, 190, 215, 0.75);
          line-height: 1.7;
          font-weight: 300;
          max-width: 560px;
        }

        .sf-subheading strong {
          color: rgba(220, 228, 248, 0.95);
          font-weight: 600;
        }

        /* Stats row */
        .sf-stats {
          display: flex;
          align-items: center;
          gap: 36px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .sf-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sf-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #f0f2f8;
          font-family: 'Playfair Display', serif;
        }

        .sf-stat-label {
          font-size: 11px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(180, 190, 215, 0.55);
          font-weight: 500;
        }

        .sf-stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.08);
        }

        /* Main card */
        .sf-card {
          margin-top: 60px;
          border-radius: 28px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          overflow: hidden;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.45),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 1px 0 rgba(255,255,255,0.1) inset;
        }

        /* Card header */
        .sf-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          flex-wrap: wrap;
          gap: 12px;
        }

        .sf-card-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(220,228,248,0.9);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .sf-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52,211,153,0.8), 0 0 20px rgba(52,211,153,0.35);
          animation: sf-pulse 2s infinite;
        }

        @keyframes sf-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.85); }
        }

        .sf-card-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(180, 190, 215, 0.5);
          font-weight: 500;
        }

        /* Dropdowns grid */
        .sf-dropdowns {
          padding: 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr) auto;
          gap: 16px;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .sf-dropdowns {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .sf-dropdowns {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          .sf-inner { padding: 0 20px; }
          .sf-card-header { padding: 16px 20px; }
          .sf-card-footer { padding: 16px 20px; }
        }

        /* Individual dropdown card */
        .sf-dropdown {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }

        .sf-dropdown:not(.sf-dropdown--disabled):hover {
          border-color: rgba(202,32,47,0.4);
          background: rgba(202,32,47,0.05);
          box-shadow: 0 0 30px rgba(202,32,47,0.08);
        }

        .sf-dropdown--disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .sf-dropdown-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(202,32,47,0.2), rgba(202,32,47,0.08));
          border: 1px solid rgba(202,32,47,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #e84055;
        }

        .sf-dropdown-content {
          flex: 1;
          min-width: 0;
          position: relative;
        }

        .sf-dropdown-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(180, 190, 215, 0.45);
          margin-bottom: 5px;
        }

        .sf-dropdown-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sf-dropdown-select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          color: rgba(220,228,248,0.9);
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding-right: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sf-dropdown-select:disabled {
          cursor: not-allowed;
          color: rgba(180,190,215,0.4);
        }

        .sf-dropdown-select option {
          background: #111827;
          color: #e5e7eb;
        }

        .sf-chevron {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(180,190,215,0.35);
        }

        /* Submit button */
        .sf-submit {
          background: linear-gradient(135deg, #e84055 0%, #ca202f 60%, #b01c28 100%);
          border: none;
          border-radius: 18px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 28px;
          min-width: 130px;
          box-shadow:
            0 10px 40px rgba(202,32,47,0.4),
            0 2px 0 rgba(255,255,255,0.15) inset;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }

        .sf-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .sf-submit:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 50px rgba(202,32,47,0.5), 0 2px 0 rgba(255,255,255,0.15) inset;
        }

        .sf-submit:not(:disabled):hover::before {
          opacity: 1;
        }

        .sf-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .sf-submit:disabled {
          background: rgba(255,255,255,0.07);
          box-shadow: none;
          color: rgba(180,190,215,0.3);
          cursor: not-allowed;
        }

        /* Footer */
        .sf-card-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sf-footer-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(180,190,215,0.4);
        }

        .sf-tag {
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(210,218,240,0.65);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }

        .sf-tag:hover {
          border-color: rgba(202,32,47,0.4);
          background: rgba(202,32,47,0.07);
          color: #f4737d;
        }

        .sf-footer-meta {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .sf-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(180,190,215,0.5);
        }

        .sf-meta-item svg {
          color: #e84055;
          opacity: 0.8;
        }

        /* Divider line */
        .sf-divider-line {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #ca202f, transparent);
          margin: 16px 0 24px;
          border-radius: 2px;
        }
      `}</style>

      <section className="sf-section">
        <div className="sf-grid-overlay" />

        <div className="sf-inner">
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div className="sf-badge">
              <Sparkles size={13} />
              Smart Discovery
            </div>
          </div>

          {/* Heading */}
          <h2 className="sf-heading">
            Find Expert Services
            In Your <em>Location</em>
          </h2>

          <div className="sf-divider-line" />

          <p className="sf-subheading">
            Connect with <strong>10,000+ verified professionals</strong> across
            countries worldwide — instantly, reliably, and with full confidence.
          </p>

          {/* Stats */}
          {/* <div className="sf-stats">
            <div className="sf-stat">
              <span className="sf-stat-value">10K+</span>
              <span className="sf-stat-label">Professionals</span>
            </div>
            <div className="sf-stat-divider" />
            <div className="sf-stat">
              <span className="sf-stat-value">180+</span>
              <span className="sf-stat-label">Countries</span>
            </div>
            <div className="sf-stat-divider" />
            <div className="sf-stat">
              <span className="sf-stat-value">4.9★</span>
              <span className="sf-stat-label">Avg. Rating</span>
            </div>
          </div> */}

          {/* Main Card */}
          <div className="sf-card">
            {/* Card Header */}
            <div className="sf-card-header">
              <div className="sf-card-header-left">
                <span className="sf-live-dot" />
                Global Service Search
              </div>
              <div className="sf-card-header-right">
                <Globe size={14} />
                Worldwide Coverage
              </div>
            </div>

            {/* Dropdowns */}
            <div className="sf-dropdowns">
              <DropdownCard
                icon={<Briefcase size={20} />}
                label="Service"
                value={selectedService?.id ?? ""}
                placeholder="Select service"
                onChange={handleServiceChange}
                disabled={false}
                options={SERVICE_OPTIONS.map((s) => ({
                  id: s.id,
                  name: s.shortName,
                }))}
              />

              <DropdownCard
                icon={<Globe size={20} />}
                label="Country"
                value={selectedCountry?.id ?? ""}
                placeholder={loading.countries ? "Loading…" : "Select country"}
                onChange={handleCountryChange}
                disabled={loading.countries}
                options={countries}
              />

              <DropdownCard
                icon={<MapPin size={20} />}
                label="State / Region"
                value={selectedState?.id ?? ""}
                placeholder={loading.states ? "Loading…" : "Select state"}
                onChange={handleStateChange}
                disabled={!selectedCountry || loading.states}
                options={states}
              />

              <DropdownCard
                icon={<Building2 size={20} />}
                label="City"
                value={selectedCity?.id ?? ""}
                placeholder={
                  loading.cities ? "Loading…" :
                  selectedState && !loading.cities && cities.length === 0 ? "No cities available" :
                  "Select city"
                }
                onChange={handleCityChange}
                disabled={!selectedState || loading.cities || (!loading.cities && selectedState && cities.length === 0)}
                options={cities}
              />

              <button
                className="sf-submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                <Search size={17} />
                {buttonLabel}
                <ArrowRight size={15} style={{ opacity: 0.75 }} />
              </button>
            </div>

            {/* Card Footer */}
            {/* <div className="sf-card-footer">
              <div className="sf-footer-label">
                <TrendingUp size={13} className="text-[#ca202f]" />
                Popular
              </div>
              {["India", "USA", "UK", "UAE", "Canada"].map((t) => (
                <span key={t} className="sf-tag">{t}</span>
              ))}
              <div className="sf-footer-meta">
                <div className="sf-meta-item">
                  <Shield size={13} />
                  Verified Experts
                </div>
                <div className="sf-meta-item">
                  <Clock3 size={13} />
                  24/7 Support
                </div>
                <div className="sf-meta-item">
                  <Star size={13} />
                  Trusted Worldwide
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

function DropdownCard({ icon, label, value, placeholder, onChange, disabled, options }) {
  return (
    <div className={`sf-dropdown${disabled ? " sf-dropdown--disabled" : ""}`}>
      <div className="sf-dropdown-icon">{icon}</div>
      <div className="sf-dropdown-content">
        <p className="sf-dropdown-label">{label}</p>
        <div className="sf-dropdown-select-wrap">
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="sf-dropdown-select"
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.id} value={String(opt.id)}>
                {opt.name}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="sf-chevron" />
        </div>
      </div>
    </div>
  );
}
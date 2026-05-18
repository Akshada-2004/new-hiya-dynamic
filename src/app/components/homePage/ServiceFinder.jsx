"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Briefcase,
  ChevronDown,
  Globe,
  MapPin,
  Search,
  Sparkles,
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

    const serviceSlug = selectedService.id;
    const countrySlug = selectedCountry.slug;

    if (selectedState && selectedCity) {
      router.push(`/${countrySlug}-${serviceSlug}-in-${selectedCity.slug}`);
      return;
    }

    if (selectedState) {
      router.push(`/${countrySlug}-${serviceSlug}-in-${selectedState.slug}`);
      return;
    }

    router.push(`/${serviceSlug}-in-${countrySlug}`);
  }

  const canSubmit = Boolean(selectedService && selectedCountry);

  const buttonLabel =
    selectedService && selectedCountry && selectedState && selectedCity
      ? `${selectedService.shortName} in ${selectedCity.name}`
      : selectedService && selectedCountry && selectedState
        ? `${selectedService.shortName} in ${selectedState.name}`
        : selectedService && selectedCountry
          ? `${selectedService.shortName} in ${selectedCountry.name}`
          : "Search services";

  return (
    <section className="bg-[#f7f7f7] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.35fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ca202f]/10 px-5 py-2 text-sm font-semibold text-[#ca202f]">
              <Sparkles size={16} />
              Smart Discovery
            </div>

            <h2 className="text-[30px] font-bold leading-tight text-slate-900 sm:text-[36px] lg:text-[40px]">
              Find Expert Services In Your{" "}
              <span className="text-[#ca202f]">Location</span>
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Select your service and location to open the right local page for
              your business needs.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
              <MiniStat value="10K+" label="Clients" />
              <MiniStat value="250+" label="Cities" />
              <MiniStat value="24/7" label="Support" />
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Search by location
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Country required hai; state aur city optional hain.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                <Globe size={14} className="text-[#ca202f]" />
                Worldwide coverage
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                icon={<Briefcase size={20} />}
                label="Service"
                value={selectedService?.id ?? ""}
                placeholder="Select service"
                onChange={handleServiceChange}
                options={SERVICE_OPTIONS.map((service) => ({
                  id: service.id,
                  name: service.shortName,
                }))}
              />

              <SelectField
                icon={<Globe size={20} />}
                label="Country"
                value={selectedCountry?.id ?? ""}
                placeholder={loading.countries ? "Loading..." : "Select country"}
                onChange={handleCountryChange}
                disabled={loading.countries}
                options={countries}
              />

              <SelectField
                icon={<MapPin size={20} />}
                label="State / Region"
                value={selectedState?.id ?? ""}
                placeholder={loading.states ? "Loading..." : "Select state"}
                onChange={handleStateChange}
                disabled={!selectedCountry || loading.states}
                options={states}
              />

              <SelectField
                icon={<Building2 size={20} />}
                label="City"
                value={selectedCity?.id ?? ""}
                placeholder={
                  loading.cities
                    ? "Loading..."
                    : selectedState && !loading.cities && cities.length === 0
                      ? "No cities available"
                      : "Select city"
                }
                onChange={handleCityChange}
                disabled={
                  !selectedState ||
                  loading.cities ||
                  (!loading.cities && selectedState && cities.length === 0)
                }
                options={cities}
              />
            </div>

            <button
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#ca202f] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#ca202f]/20 transition-all hover:bg-[#b51c2b] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <Search size={18} />
              <span className="truncate">{buttonLabel}</span>
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="border-r border-gray-100 px-4 py-4 text-center last:border-r-0">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function SelectField({
  icon,
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
  options,
}) {
  return (
    <label
      className={`group flex min-h-[86px] items-center gap-4 rounded-2xl border bg-[#fbfbfb] p-4 transition ${
        disabled
          ? "border-gray-100 opacity-60"
          : "border-gray-200 hover:border-[#ca202f]/40 hover:bg-white hover:shadow-md"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ca202f]/10 text-[#ca202f] transition group-hover:bg-[#ca202f] group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[2px] text-slate-400">
          {label}
        </span>
        <span className="relative block">
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full appearance-none bg-transparent pr-7 text-sm font-semibold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.id} value={String(option.id)}>
                {option.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </span>
      </span>
    </label>
  );
}

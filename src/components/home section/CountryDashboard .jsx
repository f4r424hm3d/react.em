

import React, { useState, useEffect } from "react";
import {
  Globe2,
  Users,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import api from "../../api";

/* ---------------------- UTILITY FUNCTIONS ---------------------- */

// Convert Tailwind color classes to hex colors
const colorMap = {
  "bg-emerald-300": "#6ee7b7",
  "bg-red-300": "#fca5a5",
  "bg-blue-300": "#93c5fd",
  "bg-amber-300": "#fcd34d",
  "bg-purple-300": "#d8b4fe",
  "bg-lime-300": "#bef264",
  "bg-orange-300": "#fdba74",
  "bg-pink-300": "#f9a8d4",
  "bg-cyan-300": "#67e8f9",
  "bg-rose-300": "#fda4af",
};

// Transform API response to chart data format
function transformApiData(apiResponse) {
  if (!apiResponse || !apiResponse.years) return { chartData: [], countryColors: {}, allCountries: [] };

  const countryColorsMap = {};
  const allCountriesSet = new Set();

  // First pass: collect all countries and their colors
  apiResponse.years.forEach(yearData => {
    yearData.items.forEach(item => {
      // Handle potential missing 'country' prop by checking 'country_name', 'name', 'label', 'category'
      const countryName = item.country || item.country_name || item.name || item.label || item.category || "Unknown";

      allCountriesSet.add(countryName);
      if (!countryColorsMap[countryName]) {
        countryColorsMap[countryName] = colorMap[item.color] || "#94a3b8";
        // Also map the original item.country in case chart links back, 
        // but charts usually use the string keys from this map.
      }
    });
  });

  // Second pass: create chart data
  const chartData = apiResponse.years.map(yearData => {
    const yearObj = { year: yearData.year.toString() };

    yearData.items.forEach(item => {
      const countryName = item.country || item.country_name || item.name || item.label || item.category || "Unknown";
      yearObj[countryName] = item.count;
    });

    return yearObj;
  }).reverse(); // Reverse to show oldest to newest

  return {
    chartData,
    countryColors: countryColorsMap,
    allCountries: Array.from(allCountriesSet),
  };
}

/* ---------------------- SUB-COMPONENTS ---------------------- */

function CountryLegend({ selectedCountries, onToggleCountry, countryColors }) {
  const [searchTerm, setSearchTerm] = useState("");
  const countries = Object.keys(countryColors).filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003893] focus:border-transparent bg-white/80"
        />
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-4 max-h-48 overflow-y-auto scrollbar-hide">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => onToggleCountry(country)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:bg-slate-50 shadow-sm ${selectedCountries.includes(country)
              ? "opacity-100 bg-slate-50 ring-1 ring-slate-200"
              : "opacity-50 grayscale"
              }`}
          >
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow"
              style={{ backgroundColor: countryColors[country] }}
            />
            <span className="text-slate-700">{country}</span>
          </button>
        ))}
        {countries.length === 0 && (
          <p className="text-sm text-gray-500 w-full text-center py-2">No countries found</p>
        )}
      </div>
    </div>
  );
}



function StackedBarChart({ data, selectedCountries, countryColors }) {
  const [hoverInfo, setHoverInfo] = useState(null);

  const maxTotal = Math.max(
    ...data.map((yearData) => {
      return selectedCountries.reduce((sum, country) => {
        const value = yearData[country];
        return sum + (typeof value === "number" ? value : 0);
      }, 0);
    })
  );

  const yAxisMax = Math.ceil(maxTotal / 10000) * 10000;
  const yAxisSteps = 6;
  const yAxisInterval = yAxisMax / (yAxisSteps - 1);
  const chartHeight = 320;
  const xAxisLabelHeight = 36;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] flex gap-4">
        {/* Y-Axis Labels */}
        <div
          style={{ width: "60px" }}
          className="flex flex-col justify-between pt-0 pb-6 text-[10px] sm:text-xs text-slate-600 font-medium"
        >
          {Array.from({ length: yAxisSteps }).map((_, i) => {
            const value = yAxisMax - i * yAxisInterval;
            return (
              <div key={i} className="text-right h-0">
                {Math.round(value / 1000)}k
              </div>
            );
          })}
        </div>

        {/* Chart + X axis labels */}
        <div className="flex-1">
          <div
            className="relative"
            style={{ height: chartHeight + xAxisLabelHeight }}
          >
            {/* Chart box with axis & grid */}
            <div
              className="absolute inset-x-0 top-0 border-l-2 border-b-2 border-slate-200 bg-white/40 rounded-xl rounded-b-none"
              style={{ height: chartHeight }}
            >
              {/* Horizontal Grid Lines */}
              {Array.from({ length: yAxisSteps - 1 }).map((_, i) => (
                <div
                  key={`grid-${i}`}
                  className="absolute w-full border-t border-slate-100"
                  style={{
                    top: `${(i / (yAxisSteps - 1)) * 100}%`,
                  }}
                />
              ))}

              {/* Tooltip (global) */}
              {hoverInfo && (
                <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs sm:text-sm rounded-lg px-3 py-2 shadow-lg z-20">
                  <div className="font-semibold flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: countryColors[hoverInfo.country] }}
                    />
                    {hoverInfo.country}
                  </div>
                  <div className="text-[11px] opacity-80">
                    Year: {hoverInfo.year}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm">
                    {hoverInfo.value.toLocaleString()} applications
                  </div>
                </div>
              )}

              {/* Bars */}
              <div className="absolute inset-0 flex items-end px-2 pb-6 gap-3">
                {data.map((yearData) => {
                  const total = selectedCountries.reduce((sum, country) => {
                    const value = yearData[country];
                    return sum + (typeof value === "number" ? value : 0);
                  }, 0);

                  const heightPercent = (total / yAxisMax) * 100;

                  return (
                    <div
                      key={yearData.year}
                      className="flex-1 h-full flex flex-col items-center justify-end"
                    >
                      <div
                        className="w-full relative rounded-t-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-slate-100/60"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: "30px",
                        }}
                      >
                        {selectedCountries.map((country, idx) => {
                          const value = yearData[country];
                          const numValue =
                            typeof value === "number" ? value : 0;
                          const segmentHeight = total
                            ? (numValue / total) * 100
                            : 0;

                          return (
                            <div
                              key={`${yearData.year}-${country}-${idx}`}
                              className="w-full relative transition-all hover:brightness-110 cursor-pointer"
                              style={{
                                height: `${segmentHeight}%`,
                                backgroundColor: countryColors[country],
                                minHeight: numValue > 0 ? "4px" : "0px",
                              }}
                              title={`${country}: ${numValue.toLocaleString()}`}
                              onMouseEnter={() =>
                                setHoverInfo({
                                  country,
                                  year: yearData.year,
                                  value: numValue,
                                })
                              }
                              onMouseLeave={() => setHoverInfo(null)}
                            >
                              {segmentHeight > 8 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-white font-bold text-[10px] sm:text-xs drop-shadow px-1 truncate max-w-full">
                                    {numValue > 1000 ? (numValue / 1000).toFixed(1) + 'k' : numValue}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Year Labels */}
            <div className="absolute inset-x-0 bottom-0 h-[36px] flex items-center px-2 gap-3">
              <div className="flex-1 flex gap-3">
                {data.map((yearData) => (
                  <div
                    key={yearData.year}
                    className="flex-1 text-center text-[11px] sm:text-xs font-semibold text-slate-700"
                  >
                    {yearData.year}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartSection({ selectedCountries, chartData, countryColors }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-4 sm:p-8 mb-6 sm:mb-10">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 text-center">
        Application Volume by Year & Country
      </h3>
      <StackedBarChart
        data={chartData}
        selectedCountries={selectedCountries}
        countryColors={countryColors}
      />
    </div>
  );
}

const StatsGrid = ({ apiData, chartData, countryColors }) => {
  // Calculate leading country (use latest year)
  const latestYearData = apiData?.years?.[apiData.years.length - 1];
  const leadingCountry = latestYearData?.items?.reduce((max, item) =>
    item.count > (max?.count || 0) ? item : max
    , null);

  const leadingCountryName = leadingCountry ? (leadingCountry.country || leadingCountry.country_name || leadingCountry.name || leadingCountry.label || leadingCountry.category || "Unknown") : "N/A";

  // Calculate growth rate
  // chartData is reversed (index 0 is newest, last is oldest)
  const newestYear = chartData[0];
  const oldestYear = chartData[chartData.length - 1];
  let growthRate = "N/A";

  if (oldestYear && newestYear) {
    const oldTotal = Object.keys(countryColors).reduce((sum, country) =>
      sum + (oldestYear[country] || 0), 0);
    const newTotal = Object.keys(countryColors).reduce((sum, country) =>
      sum + (newestYear[country] || 0), 0);

    if (oldTotal > 0) {
      growthRate = Math.round(((newTotal - oldTotal) / oldTotal) * 100) + "%";
      if (growthRate.indexOf("-") === -1 && growthRate !== "0%") growthRate = "+" + growthRate;
    }
  }

  const stats = [
    {
      icon: Users,
      label: "Total Applications",
      value: apiData?.overall_total?.toLocaleString() || "0",
      change: `Across ${chartData.length} years`,
      color: "emerald",
    },
    {
      icon: Globe2,
      label: "Countries",
      value: Object.keys(countryColors).length.toString(),
      change: "Top source countries",
      color: "blue",
    },
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: growthRate,
      change: `${oldestYear?.year || ""}-${newestYear?.year || ""} period`,
      color: "amber",
    },
    {
      icon: Award,
      label: "Leading Source Country",
      value: leadingCountryName,
      change: `${leadingCountry?.count?.toLocaleString() || 0} in ${latestYearData?.year || ""}`,
      color: "rose",
    },
  ];

  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl shadow-inner ${colorClasses[stat.color]
                  }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------- MAIN EXPORTED COMPONENT ---------------------- */

export default function TopCountriesApplicationsSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [countryColors, setCountryColors] = useState({});
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from API using imported api
        const response = await api.get("/international-student-data-stats/stats/years");
        const data = response.data;

        setApiData(data);
        console.log('Country Dashboard Data:', data);

        // Transform data
        const { chartData: transformedChartData, countryColors: colors, allCountries: countries } = transformApiData(data);

        setChartData(transformedChartData);
        setCountryColors(colors);
        setAllCountries(countries);
        setSelectedCountries(countries); // Select all countries by default

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
          <h2 className="text-red-800 font-bold text-xl mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header / Hero Section */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#003893] to-[#003893] rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <Globe2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-4">
              Global Footprint of International Student Applications to Malaysia
              {/* <span className="bg-gradient-to-r from-[#003893] to-[#003893] bg-clip-text text-transparent">
                come from?
              </span> */}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto px-4">
              Top {allCountries.length} Highest Application Countries for New Applications Received
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              {apiData?.overall_total?.toLocaleString() || 0} total applications across{" "}
              {allCountries.length} source countries
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Filters */}
        <CountryLegend
          selectedCountries={selectedCountries}
          onToggleCountry={(country) => {
            setSelectedCountries((prev) => {
              // Smart Toggle Logic:
              // 1. If currently ALL are selected, select ONLY the clicked one
              if (prev.length === allCountries.length) {
                return [country];
              }
              // 2. If currently ONLY the clicked one is selected, select ALL (reset)
              if (prev.length === 1 && prev[0] === country) {
                return allCountries;
              }
              // 3. Otherwise toggle normally
              if (prev.includes(country)) {
                // If removing it would leave empty set, reset to ALL
                const newSelection = prev.filter((c) => c !== country);
                return newSelection.length === 0 ? allCountries : newSelection;
              } else {
                return [...prev, country];
              }
            });
          }}
          countryColors={countryColors}
        />

        {/* Chart */}
        <ChartSection
          selectedCountries={selectedCountries}
          chartData={chartData}
          countryColors={countryColors}
        />

        {/* Stats / Summary */}
        <StatsGrid
          apiData={apiData}
          chartData={chartData}
          countryColors={countryColors}
        />
      </main>
    </div>
  );
}
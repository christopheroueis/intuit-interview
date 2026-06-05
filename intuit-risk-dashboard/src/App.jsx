import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Cell } from 'recharts';
import { AlertCircle, TrendingUp, ShieldAlert, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';

// --- DATA ---
const monthlyData = [
  { month: 'Jan', loss: 5.7, volume: 32.1, disputes: 45 },
  { month: 'Feb', loss: 2.1, volume: 29.8, disputes: 38 },
  { month: 'Mar', loss: 20.9, volume: 35.4, disputes: 82 },
  { month: 'Apr', loss: 14.4, volume: 33.2, disputes: 65 },
  { month: 'May', loss: 8.9, volume: 34.1, disputes: 55 },
  { month: 'Jun', loss: 8.2, volume: 33.9, disputes: 50 },
  { month: 'Jul', loss: 11.7, volume: 36.2, disputes: 62 },
  { month: 'Aug', loss: 2.0, volume: 34.5, disputes: 40 },
  { month: 'Sep', loss: 13.7, volume: 35.1, disputes: 70 },
  { month: 'Oct', loss: 3.0, volume: 36.8, disputes: 48 },
  { month: 'Nov', loss: 2.9, volume: 38.2, disputes: 42 },
  { month: 'Dec', loss: 19.3, volume: 42.1, disputes: 95 }
];

const forecastData = [
  { month: 'Jan', actual: 5.7, forecast_base: null, forecast_opt: null, forecast_pess: null },
  { month: 'Jun', actual: 8.2, forecast_base: null, forecast_opt: null, forecast_pess: null },
  { month: 'Dec', actual: 19.3, forecast_base: 19.3, forecast_opt: 19.3, forecast_pess: 19.3 },
  { month: 'Jan 22', actual: null, forecast_base: 10.5, forecast_opt: 8.9, forecast_pess: 12.1 },
  { month: 'Feb 22', actual: null, forecast_base: 9.8, forecast_opt: 8.3, forecast_pess: 11.3 },
  { month: 'Mar 22', actual: null, forecast_base: 12.4, forecast_opt: 10.5, forecast_pess: 14.3 },
  { month: 'Apr 22', actual: null, forecast_base: 10.1, forecast_opt: 8.6, forecast_pess: 11.6 },
  { month: 'May 22', actual: null, forecast_base: 10.2, forecast_opt: 8.7, forecast_pess: 11.7 },
  { month: 'Jun 22', actual: null, forecast_base: 9.6, forecast_opt: 8.2, forecast_pess: 11.0 },
  { month: 'Jul 22', actual: null, forecast_base: 10.8, forecast_opt: 9.2, forecast_pess: 12.4 },
  { month: 'Aug 22', actual: null, forecast_base: 8.5, forecast_opt: 7.2, forecast_pess: 9.8 },
  { month: 'Sep 22', actual: null, forecast_base: 10.4, forecast_opt: 8.8, forecast_pess: 12.0 },
  { month: 'Oct 22', actual: null, forecast_base: 9.2, forecast_opt: 7.8, forecast_pess: 10.6 },
  { month: 'Nov 22', actual: null, forecast_base: 9.4, forecast_opt: 8.0, forecast_pess: 10.8 },
  { month: 'Dec 22', actual: null, forecast_base: 14.2, forecast_opt: 12.1, forecast_pess: 16.3 }
];

const channelRiskData = [
  { channel: 'MONEY', volume: 2.3, loss: 3.2, bps: 137.4, multiplier: 49 },
  { channel: 'QBOFTU', volume: 17.5, loss: 7.7, bps: 44.0, multiplier: 16 },
  { channel: 'IF', volume: 8.1, loss: 2.3, bps: 28.5, multiplier: 10 },
  { channel: 'GPWeb', volume: 2.1, loss: 0.5, bps: 25.1, multiplier: 9 },
  { channel: 'QBDT', volume: 147.1, loss: 21.3, bps: 1.4, multiplier: 0.5 },
  { channel: 'QBO', volume: 193.0, loss: 34.5, bps: 1.8, multiplier: 0.6 }
].sort((a, b) => b.bps - a.bps);

const geoRiskData = [
  { state: 'NC', loss: 12.7, bps: 11.4 },
  { state: 'MA', loss: 5.9, bps: 6.5 },
  { state: 'CA', loss: 32.9, bps: 6.1 },
  { state: 'IL', loss: 5.0, bps: 4.5 },
  { state: 'TX', loss: 18.9, bps: 4.3 },
  { state: 'FL', loss: 14.1, bps: 3.5 }
].sort((a, b) => b.bps - a.bps);

// --- COMPONENTS ---

const MetricCard = ({ title, value, subtitle, suffix = '', icon: Icon, trend, trendValue, isAlert = false }) => (
  <div className={`p-6 bg-white rounded-xl border ${isAlert ? 'border-red-300 shadow-sm' : 'border-gray-200'} shadow-sm flex flex-col`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${isAlert ? 'bg-red-50 text-[#E5461B]' : 'bg-blue-50 text-[#0077C5]'}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      {trend && (
        <span className={`text-sm font-semibold flex items-center ${trend === 'up' && isAlert ? 'text-red-600' : 'text-green-600'}`}>
          {trend === 'up' ? '↗' : '↘'} {trendValue}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
      {value}<span className="text-lg font-medium text-gray-500 ml-1">{suffix}</span>
    </div>
    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg outline-none">
        <p className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm py-1 min-w-[160px]">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              <span className="text-gray-600 font-medium">{entry.name}</span>
            </div>
            <span className="font-semibold text-gray-900 ml-4">
              {entry.name.includes('Loss') || entry.name.includes('Forecast') || entry.name.includes('Actuals') ? '$' : ''}
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name.includes('Volume') ? 'M' : entry.name.includes('Loss') || entry.name.includes('Forecast') || entry.name.includes('Actuals') ? 'K' : entry.name.includes('bps') ? ' bps' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('executive');

  const navItems = [
    { id: 'executive', label: 'Executive Summary' },
    { id: 'channels', label: 'Risk Segments' },
    { id: 'forecast', label: '2022 Outlook' },
    { id: 'recommendations', label: 'Strategic Plan' }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-16">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/intuitlogo.png" alt="Intuit" className="w-9 h-9 rounded-lg shadow-sm object-contain bg-white" />
            <div>
              <h1 className="text-xl font-extrabold text-[#1B3A6B] tracking-tight">QuickBooks Payments</h1>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Risk & Fraud Analytics</div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1.5 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-white text-[#0077C5] shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <select
            className="md:hidden text-sm font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            aria-label="Dashboard section"
          >
            {navItems.map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 mt-10">

        {/* TAB: EXECUTIVE */}
        {activeTab === 'executive' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-8">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-extrabold text-[#1B3A6B] tracking-tight">2021 Retrospective</h2>
                <p className="text-gray-500 mt-3 text-lg leading-relaxed">A macro-level view of network health contrasted with deep, hyper-concentrated segment vulnerabilities.</p>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
                <span className="px-3.5 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200/60 shadow-sm flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-600" /> MACRO HEALTH: STRONG
                </span>
                <span className="px-3.5 py-1.5 bg-red-50 text-[#E5461B] text-xs font-bold rounded-full border border-red-200/60 shadow-sm flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-[#E5461B]" /> SEGMENT RISK: CRITICAL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total Network Vol" value="$403.6" suffix="M" subtitle="Jan-Dec 2021" icon={DollarSign} />
              <MetricCard title="Actual IntuitLoss" value="$112.7" suffix="K" subtitle="Terminal loss unrecovered" icon={TrendingUp} />
              <MetricCard title="Network Loss Rate" value="2.8" suffix="bps" subtitle="Objectively excellent" icon={ShieldCheck} />
              <MetricCard title="MONEY Channel Risk" value="137.4" suffix="bps" subtitle="49x Network Average" icon={AlertCircle} isAlert={true} trend="up" trendValue="+4800%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">2021 Disputed Volume vs Unrecoverable Loss</h3>
                    <p className="text-sm text-gray-500 mt-1">Loss is driven by specific events (tax season, stimulus), not raw volume scale.</p>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }} dy={12} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#E5461B', fontSize: 12, fontWeight: 600 }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                      <Legend wrapperStyle={{ paddingTop: '25px' }} iconType="circle" />
                      <Bar yAxisId="left" dataKey="disputes" name="Disputes Filed (Count)" fill="#F3F4F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Line yAxisId="right" type="monotone" dataKey="loss" name="Actual Loss ($K)" stroke="#E5461B" strokeWidth={3} dot={{ r: 5, fill: '#E5461B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1B3A6B] to-[#12274A] p-8 rounded-2xl text-white shadow-md flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#0077C5] rounded-full blur-3xl opacity-20"></div>

                <h3 className="text-2xl font-bold mb-5 tracking-tight relative z-10">The Narrative is Sub-Surface</h3>
                <p className="text-blue-100 mb-8 text-base leading-relaxed relative z-10 font-medium">
                  Applying universal friction harms legitimate merchants. Our analysis reveals extreme vulnerability localized inside three specific cohorts:
                </p>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/90 font-semibold text-sm">New Accounts (&lt;30d)</span>
                    <span className="font-extrabold text-[#F4A01C]">19% of Losses</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/90 font-semibold text-sm">Top 9 MCCs</span>
                    <span className="font-extrabold text-[#F4A01C]">80% of Losses</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/90 font-semibold text-sm">CA, TX & FL</span>
                    <span className="font-extrabold text-[#F4A01C]">60% of Losses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHANNELS */}
        {activeTab === 'channels' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-gray-200 pb-6 mb-8 max-w-3xl">
              <h2 className="text-4xl font-extrabold text-[#1B3A6B] tracking-tight">Vulnerability Mapping</h2>
              <p className="text-gray-500 mt-3 text-lg leading-relaxed">Deconstructing risk by channel and geography to isolate where predictive ML and strict limits should be applied.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Channel Risk Asymmetry</h3>
                <p className="text-sm text-gray-500 mb-8">Loss rate (bps) compared against total volume.</p>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={channelRiskData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                      <YAxis dataKey="channel" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1B3A6B', fontWeight: 600, fontSize: 13 }} width={80} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                      <Bar dataKey="bps" name="Loss Rate (bps)" radius={[0, 4, 4, 0]} barSize={32}>
                        {
                          channelRiskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.bps > 5 ? '#E5461B' : '#0077C5'} />
                          ))
                        }
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-5 bg-[#FEF2F2] rounded-xl border border-red-100 flex items-start gap-4">
                  <AlertCircle className="text-[#E5461B] shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900 leading-relaxed">
                    <strong>Critical Finding:</strong> The MONEY product processes transactions at an unsustainable <strong>137 bps</strong>—which is 49x the network average risk rate.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Geographic Anomalies</h3>
                <p className="text-sm text-gray-500 mb-8">Highest relative risk states (min $100K volume).</p>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={geoRiskData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                      <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1B3A6B', fontWeight: 600, fontSize: 13 }} width={80} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                      <Bar dataKey="bps" name="Loss Rate (bps)" radius={[0, 4, 4, 0]} barSize={32}>
                        {
                          geoRiskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.state === 'NC' ? '#F4A01C' : '#0077C5'} />
                          ))
                        }
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-5 bg-[#FFFBEB] rounded-xl border border-amber-100 flex items-start gap-4">
                  <AlertCircle className="text-[#D97706] shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong>Critical Finding:</strong> North Carolina (NC) generates a massive localized anomaly. Despite only $11.2M in volume, it experienced an <strong>11.4 bps</strong> loss rate.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: FORECAST */}
        {activeTab === 'forecast' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-gray-200 pb-6 mb-8 max-w-3xl">
              <h2 className="text-4xl font-extrabold text-[#1B3A6B] tracking-tight">2022 Expected Outcomes</h2>
              <p className="text-gray-500 mt-3 text-lg leading-relaxed">Sizing loss exposure using a multi-granularity ensemble (Weekly SARIMA, Weekly ETS, Daily Prophet).</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="h-[450px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }} dy={12} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 13 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '25px' }} iconType="circle" />

                    <Area type="monotone" dataKey="forecast_pess" name="Worst-Case Bound" fill="#FEE2E2" stroke="none" fillOpacity={0.4} />
                    <Area type="monotone" dataKey="forecast_opt" name="Best-Case Bound" fill="#FFFFFF" stroke="none" fillOpacity={1} />

                    <Line type="monotone" dataKey="actual" name="2021 Actuals ($K)" stroke="#9CA3AF" strokeWidth={3} dot={{ r: 5, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="forecast_base" name="Base Ensemble ($119K)" stroke="#0077C5" strokeWidth={4} dot={{ r: 5, fill: '#0077C5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="forecast_opt" name="Optimistic Target ($90K)" stroke="#2ECC71" strokeWidth={2} strokeDasharray="6 6" dot={false} />
                    <Line type="monotone" dataKey="forecast_pess" name="Pessimistic Scenario ($135K)" stroke="#E5461B" strokeWidth={2} strokeDasharray="6 6" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white border border-gray-200 rounded-2xl relative shadow-sm transition-transform hover:-translate-y-1 duration-200">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2ECC71]"></div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Optimistic Target</h4>
                <p className="text-4xl font-extrabold text-[#2ECC71] mb-3">~$90K</p>
                <p className="text-gray-500 text-sm leading-relaxed">Achieved if Product immediately implements MONEY channel friction and 30-day quarantine protocols.</p>
              </div>

              <div className="p-8 bg-white border-2 border-[#0077C5] rounded-2xl relative shadow-md transform scale-105 z-10 hidden md:block">
                <div className="absolute top-0 right-0 bg-[#0077C5] text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-lg">Median Forecast</div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Ensemble Base Case</h4>
                <p className="text-5xl font-extrabold text-[#0077C5] mb-3">$119K</p>
                <p className="text-gray-600 text-sm leading-relaxed">Validates perfectly against a 10,000-iteration Monte Carlo lognormal simulation median ($114K).</p>
              </div>

              <div className="p-8 bg-white border border-gray-200 rounded-2xl relative shadow-sm transition-transform hover:-translate-y-1 duration-200 hover:shadow-md md:hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0077C5]"></div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Ensemble Base Case</h4>
                <p className="text-4xl font-extrabold text-[#0077C5] mb-3">$119K</p>
                <p className="text-gray-500 text-sm leading-relaxed">Validates against Monte Carlo simulation median ($114K).</p>
              </div>

              <div className="p-8 bg-white border border-gray-200 rounded-2xl relative shadow-sm transition-transform hover:-translate-y-1 duration-200">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E5461B]"></div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Pessimistic Stress Test</h4>
                <p className="text-4xl font-extrabold text-[#E5461B] mb-3">$135K+</p>
                <p className="text-gray-500 text-sm leading-relaxed">Modeled on macro deterioration and scaled organized fraud within known high-risk CA/NC geographies.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="border-b border-gray-200 pb-6 mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-[#1B3A6B] tracking-tight">Strategic Countermeasures</h2>
              <p className="text-gray-500 mt-4 text-lg leading-relaxed max-w-2xl mx-auto">Data-driven mandates across Product, Operations, and Engineering to reduce 2022 aggregate losses by up to 20%.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group hover:border-[#E5461B]/50 transition-colors">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-[#E5461B] group-hover:w-2 transition-all"></div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 rounded-xl bg-red-50 text-[#E5461B] flex items-center justify-center shrink-0 border border-red-100">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">The "First 30 Days" Probation</h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">Nearly 20% of network loss volume occurs within 30 days of account opening. Product and Risk must collaborate to enforce strict velocity caps and ticket-size maximums within a merchant's first 30 days. Accounts must demonstrate clean processing history prior to unlocking full tier functionality.</p>
                    <div className="flex flex-wrap items-center text-sm font-semibold gap-3">
                      <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full border border-gray-200">Owner: Risk Policy</span>
                      <span className="bg-red-50 text-[#E5461B] px-4 py-1.5 rounded-full border border-red-100">Priority: Critical (Immediate)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group hover:border-[#F4A01C]/50 transition-colors">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-[#F4A01C] group-hover:w-2 transition-all"></div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-100">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Suspend MONEY Channel Instant-Onboarding</h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">The MONEY channel processes transactions at an unsustainable 137 bps of loss. We must immediately suspend instant-onboarding features for this product and initiate a forensic audit of the KYC/KYB workflow to identify how bad actors are bypassing identity checkpoints.</p>
                    <div className="flex flex-wrap items-center text-sm font-semibold gap-3">
                      <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full border border-gray-200">Owner: Core Product + Identity</span>
                      <span className="bg-amber-50 text-[#D97706] px-4 py-1.5 rounded-full border border-amber-100">Priority: High (Next 30 Days)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group hover:border-[#0077C5]/50 transition-colors">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-[#0077C5] group-hover:w-2 transition-all"></div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0077C5] flex items-center justify-center shrink-0 border border-blue-100">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Shadow Deploy the XGBoost Risk Scorer</h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">Our supervised Machine Learning temporal architecture achieved an AUC-PR of 0.285. Transition this model to shadow production to score all active accounts daily based on their distance from high-risk behavioral centroids.</p>
                    <div className="flex flex-wrap items-center text-sm font-semibold gap-3">
                      <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full border border-gray-200">Owner: Data Science</span>
                      <span className="bg-blue-50 text-[#0077C5] px-4 py-1.5 rounded-full border border-blue-100">Priority: Medium-Term (Next 90 Days)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, ShieldAlert, DollarSign, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const COLORS = {
  blue: '#0077C5',
  navy: '#1B3A6B',
  coral: '#E5461B',
  amber: '#F4A01C',
  green: '#2ECC71',
  light: '#F4F4F4',
  text: '#333333',
  subtext: '#666666'
};

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
].sort((a,b) => b.bps - a.bps);

const geoRiskData = [
  { state: 'NC', loss: 12.7, bps: 11.4 },
  { state: 'MA', loss: 5.9, bps: 6.5 },
  { state: 'CA', loss: 32.9, bps: 6.1 },
  { state: 'IL', loss: 5.0, bps: 4.5 },
  { state: 'TX', loss: 18.9, bps: 4.3 },
  { state: 'FL', loss: 14.1, bps: 3.5 }
].sort((a,b) => b.bps - a.bps);

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
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-bold text-gray-900 mb-2 border-b pb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center text-sm my-1">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            <span className="text-gray-600 mr-4">{entry.name}:</span>
            <span className="font-semibold">{entry.name.includes('Loss') || entry.name.includes('Forecast') ? '$' : ''}{entry.value}{entry.name.includes('Volume') ? 'M' : entry.name.includes('Loss') ? 'K' : ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0077C5] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1B3A6B] tracking-tight">QuickBooks Payments</h1>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Risk & Fraud Analytics</div>
            </div>
          </div>
          
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['executive', 'channels', 'forecast', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all shadow-sm ${
                  activeTab === tab
                    ? 'bg-white text-[#0077C5]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 shadow-none'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TAB: EXECUTIVE */}
        {activeTab === 'executive' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">2021 Retrospective</h2>
                <p className="text-gray-500 mt-2 text-lg">A macro view of network health vs. concentrated vulnerabilities.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                  <ShieldCheck size={14}/> Network Health: Strong
                </span>
                <span className="px-3 py-1 bg-red-100 text-[#E5461B] text-xs font-bold rounded-full border border-red-200 flex items-center gap-1">
                  <AlertTriangle size={14}/> Segment Risk: Critical
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard title="Total Volume" value="$403.6" suffix="M" subtitle="Jan-Dec 2021" icon={DollarSign} />
              <MetricCard title="Actual Intuit Loss" value="$112.7" suffix="K" subtitle="Terminal loss unrecovered" icon={TrendingUp} />
              <MetricCard title="Network Loss Rate" value="2.8" suffix="bps" subtitle="Objectively excellent" icon={ShieldCheck} />
              <MetricCard title="MONEY Channel Risk" value="137.4" suffix="bps" subtitle="49x Network Average" icon={AlertCircle} isAlert={true} trend="up" trendValue="+4800%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex justify-between items-center">
                  2021 Disputed Volume vs Unrecoverable Loss
                  <span className="text-sm font-normal text-gray-500">Monthly ($K)</span>
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar yAxisId="left" dataKey="disputes" name="Disputes Filed (Count)" fill="#F3F4F6" stroke="#D1D5DB" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="loss" name="Actual Loss ($K)" stroke="#E5461B" strokeWidth={3} dot={{r: 4, fill: '#E5461B', strokeWidth: 2, stroke: '#fff'}} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-[#1B3A6B] p-8 rounded-xl text-white shadow-lg flex flex-col justify-center">
                <ShieldAlert size={40} className="text-[#F4A01C] mb-6" />
                <h3 className="text-2xl font-bold mb-4">The Narrative is Sub-Surface</h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Although 2.8 bps represents stellar macro performance, applying universal friction harms legitimate merchants. 
                  Our analysis reveals extreme hyper-concentration of risk in specific cohorts.
                </p>
                <div className="space-y-4 border-t border-white/20 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">New Accounts (&lt;30d)</span>
                    <span className="font-bold text-[#F4A01C]">19% of Losses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Top 9 MCCs</span>
                    <span className="font-bold text-[#F4A01C]">80% of Losses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Top 3 States (CA, TX, FL)</span>
                    <span className="font-bold text-[#F4A01C]">60% of Losses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHANNELS */}
        {activeTab === 'channels' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Vulnerability Mapping</h2>
                <p className="text-gray-500 mt-2 text-lg">Deconstructing risk by channel and geography to isolate structural anomalies.</p>
              </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Channel Risk Asymmetry</h3>
                <p className="text-sm text-gray-500 mb-6">Loss rate (bps) compared against total volume.</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={channelRiskData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                      <YAxis dataKey="channel" type="category" axisLine={false} tickLine={false} tick={{fill: '#1B3A6B', fontWeight: 'bold'}} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bps" name="Loss Rate (bps)" fill="#E5461B" radius={[0, 4, 4, 0]}>
                        {
                          channelRiskData.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={entry.bps > 5 ? '#E5461B' : '#0077C5'} />
                          ))
                        }
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 text-sm text-red-800">
                  <strong>Critical Finding:</strong> The MONEY channel processes transactions at 49x the network average risk rate.
                </div>
              </div>

               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Geographic Anomalies</h3>
                <p className="text-sm text-gray-500 mb-6">Highest relative risk states (min $100K volume).</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={geoRiskData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                      <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} tick={{fill: '#1B3A6B', fontWeight: 'bold'}} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bps" name="Loss Rate (bps)" fill="#0077C5" radius={[0, 4, 4, 0]}>
                        {
                          geoRiskData.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={entry.state === 'NC' ? '#F4A01C' : '#0077C5'} />
                          ))
                        }
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100 text-sm text-orange-800">
                  <strong>Critical Finding:</strong> North Carolina (NC) generates a massive localized anomaly: an 11.4 bps loss rate.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: FORECAST */}
        {activeTab === 'forecast' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">2022 Expected Outcomes</h2>
                <p className="text-gray-500 mt-2 text-lg">Multi-granularity ensemble forecasting via weekly SARIMA, ETS, and Daily Prophet.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      
                      <Area type="monotone" dataKey="forecast_pess" name="Pessimistic Scenario ($135K)" fill="#FEE2E2" stroke="none" fillOpacity={0.5} strokeWidth={0} />
                      <Area type="monotone" dataKey="forecast_opt" name="Optimistic Target ($90K)" fill="#FFFFFF" stroke="none" />
                      
                      <Line type="monotone" dataKey="actual" name="2021 Actuals" stroke="#9CA3AF" strokeWidth={3} dot={{r: 4}} />
                      <Line type="monotone" dataKey="forecast_base" name="Base Ensemble Expected ($119K)" stroke="#0077C5" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} />
                      <Line type="monotone" dataKey="forecast_opt" name="Optimistic" stroke="#2ECC71" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="forecast_pess" name="Pessimistic" stroke="#E5461B" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Optimistic Target</h4>
                  <p className="text-3xl font-extrabold text-green-600 mb-2">~$90K</p>
                  <p className="text-gray-500 text-sm">Achieved via immediate implementation of MONEY channel friction and 30-day quarantine protocols.</p>
                </div>
                <div className="p-6 bg-white border-2 border-[#0077C5] rounded-xl relative overflow-hidden shadow-md transform scale-105 z-10">
                  <div className="absolute top-0 right-0 bg-[#0077C5] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MEDIAN</div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Ensemble Base Case</h4>
                  <p className="text-4xl font-extrabold text-[#0077C5] mb-2">$119K</p>
                  <p className="text-gray-500 text-sm">Validates precisely against a 10,000-iteration Monte Carlo lognormal simulation median ($114K).</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Pessimistic Stress Test</h4>
                  <p className="text-3xl font-extrabold text-red-600 mb-2">$135K+</p>
                  <p className="text-gray-500 text-sm">Modeled on macro deterioration and scaled organized fraud within known high-risk CA/NC geographies.</p>
                </div>
              </div>
          </div>
        )}

        {/* TAB: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Strategic Countermeasures</h2>
                <p className="text-gray-500 mt-2 text-lg">Actionable mandates for Product, Risk Ops, and Engineering.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                
                <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="w-4 bg-[#E5461B]"></div>
                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. The "First 30 Days" Probation</h3>
                    <p className="text-gray-600 mb-4 max-w-3xl">Nearly 20% of loss volume occurs within 30 days of account opening. Product and Risk must collaborate to enforce strict velocity caps and ticket-size maximums within a merchant's first 30 days. Accounts must demonstrate 30 days of clean processing before accessing standard tier limits.</p>
                    <div className="flex items-center text-sm font-semibold text-[#1B3A6B]">
                      <span className="bg-blue-50 px-3 py-1 rounded-full mr-3 border border-blue-100">Owner: Risk Policy</span>
                      <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Impact: High</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="w-4 bg-[#F4A01C]"></div>
                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Suspend MONEY Channel Instant-Onboarding</h3>
                    <p className="text-gray-600 mb-4 max-w-3xl">The MONEY channel processes transactions at an unsustainable 137 bps of loss. We must immediately suspend instant-onboarding features for this product and initiate a forensic audit of the KYC/KYB workflow to identify synthetic identity bypasses.</p>
                    <div className="flex items-center text-sm font-semibold text-[#1B3A6B]">
                      <span className="bg-blue-50 px-3 py-1 rounded-full mr-3 border border-blue-100">Owner: Core Product + Identity</span>
                      <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Impact: High</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="w-4 bg-[#0077C5]"></div>
                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Shadow Deploy the XGBoost Risk Scorer</h3>
                    <p className="text-gray-600 mb-4 max-w-3xl">Our supervised ML temporal architecture achieved an AUC-PR of 0.285 (massive lift over random). Transition this model to shadow production to score all active accounts daily based on their distance from high-risk behavioral centroids.</p>
                    <div className="flex items-center text-sm font-semibold text-[#1B3A6B]">
                      <span className="bg-blue-50 px-3 py-1 rounded-full mr-3 border border-blue-100">Owner: Data Science</span>
                      <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Impact: Medium-Term Scalability</span>
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

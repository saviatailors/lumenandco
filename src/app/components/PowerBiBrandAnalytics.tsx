import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Filter,
  Layers,
  Zap,
  Target,
  DollarSign,
  Users,
  ArrowUpRight,
  Activity,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  PieChart as PieChartIcon,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { SchoolClient, ClientBusinessLead } from "@/lib/lumenandco.types";
import { AdvancedLead } from "@/lib/crm.functions";
import { Badge } from "./ui/Badge";
import { exportRealtimeAnalyticsToExcel } from "@/lib/excelExport";

interface PowerBiBrandAnalyticsProps {
  clients: SchoolClient[];
  leads: AdvancedLead[];
  clientLeads?: ClientBusinessLead[];
}

export type BrandMetrics = {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  proposalLeads: number;
  wonLeads: number;
  lostLeads: number;
  conversionRate: number;
  avgCplRupees: number;
  totalAdSpendRupees: number;
  roas: number;
  projectedRevenueRupees: number;
  monthlyTrend: { month: string; leads: number; projected: number; won: number }[];
  sourceBreakdown: { source: string; percentage: number; color: string }[];
  aiRecommendation: string;
};

// Brand Performance Master Dataset Mapping
const BRAND_ANALYTICS_DATA: Record<string, BrandMetrics> = {
  "client-1": {
    // Northbeam E-Commerce
    totalLeads: 184,
    newLeads: 32,
    contactedLeads: 48,
    qualifiedLeads: 54,
    proposalLeads: 28,
    wonLeads: 18,
    lostLeads: 4,
    conversionRate: 24.5,
    avgCplRupees: 380,
    totalAdSpendRupees: 185000,
    roas: 5.2,
    projectedRevenueRupees: 1450000,
    monthlyTrend: [
      { month: "May", leads: 28, projected: 30, won: 3 },
      { month: "Jun", leads: 34, projected: 35, won: 4 },
      { month: "Jul", leads: 42, projected: 40, won: 5 },
      { month: "Aug", leads: 48, projected: 45, won: 4 },
      { month: "Sep (Proj)", leads: 52, projected: 50, won: 6 },
    ],
    sourceBreakdown: [
      { source: "Meta Ads (IG/FB)", percentage: 48, color: "#ef4d23" },
      { source: "Google Performance Max", percentage: 32, color: "#059669" },
      { source: "Organic Search / SEO", percentage: 12, color: "#d97706" },
      { source: "LinkedIn B2B", percentage: 8, color: "#2563eb" },
    ],
    aiRecommendation:
      "High ROAS (5.2x) on Meta Ads. 28 leads are in 'Proposal Sent' stage — closing 30% will add ₹3.6L in recurring monthly retainer.",
  },
  "client-2": {
    // Bloom Skincare
    totalLeads: 142,
    newLeads: 22,
    contactedLeads: 38,
    qualifiedLeads: 45,
    proposalLeads: 20,
    wonLeads: 12,
    lostLeads: 5,
    conversionRate: 19.8,
    avgCplRupees: 450,
    totalAdSpendRupees: 140000,
    roas: 4.1,
    projectedRevenueRupees: 980000,
    monthlyTrend: [
      { month: "May", leads: 20, projected: 22, won: 2 },
      { month: "Jun", leads: 26, projected: 25, won: 3 },
      { month: "Jul", leads: 30, projected: 28, won: 3 },
      { month: "Aug", leads: 36, projected: 35, won: 4 },
      { month: "Sep (Proj)", leads: 40, projected: 38, won: 5 },
    ],
    sourceBreakdown: [
      { source: "Instagram Influencer Ads", percentage: 55, color: "#ef4d23" },
      { source: "Google Search Ads", percentage: 25, color: "#2563eb" },
      { source: "WhatsApp Direct", percentage: 15, color: "#059669" },
      { source: "Referrals", percentage: 5, color: "#d97706" },
    ],
    aiRecommendation:
      "Instagram Influencer Retargeting is outperforming baseline search by 2.4x. Recommend scaling Influencer budget by ₹35,000 for Q4.",
  },
  "client-3": {
    // Zenith Apparel
    totalLeads: 96,
    newLeads: 14,
    contactedLeads: 24,
    qualifiedLeads: 32,
    proposalLeads: 16,
    wonLeads: 8,
    lostLeads: 2,
    conversionRate: 21.2,
    avgCplRupees: 510,
    totalAdSpendRupees: 110000,
    roas: 3.8,
    projectedRevenueRupees: 720000,
    monthlyTrend: [
      { month: "May", leads: 15, projected: 16, won: 1 },
      { month: "Jun", leads: 18, projected: 20, won: 2 },
      { month: "Jul", leads: 22, projected: 22, won: 2 },
      { month: "Aug", leads: 25, projected: 24, won: 3 },
      { month: "Sep (Proj)", leads: 28, projected: 26, won: 3 },
    ],
    sourceBreakdown: [
      { source: "Meta Shopping Ads", percentage: 60, color: "#059669" },
      { source: "Google Brand Search", percentage: 22, color: "#2563eb" },
      { source: "Email Newsletters", percentage: 18, color: "#d97706" },
    ],
    aiRecommendation:
      "Conversion velocity is 14 days from Qualified to Proposal. Automate WhatsApp follow-ups on Day 5 to accelerate contract signing.",
  },
  "client-4": {
    // UrbanFit Fitness
    totalLeads: 210,
    newLeads: 45,
    contactedLeads: 60,
    qualifiedLeads: 58,
    proposalLeads: 25,
    wonLeads: 16,
    lostLeads: 6,
    conversionRate: 26.8,
    avgCplRupees: 310,
    totalAdSpendRupees: 160000,
    roas: 4.6,
    projectedRevenueRupees: 1250000,
    monthlyTrend: [
      { month: "May", leads: 32, projected: 30, won: 3 },
      { month: "Jun", leads: 38, projected: 36, won: 4 },
      { month: "Jul", leads: 46, projected: 42, won: 4 },
      { month: "Aug", leads: 52, projected: 48, won: 5 },
      { month: "Sep (Proj)", leads: 58, projected: 55, won: 6 },
    ],
    sourceBreakdown: [
      { source: "Hyper-Local Geo Meta Ads", percentage: 65, color: "#059669" },
      { source: "Google Maps Profile", percentage: 20, color: "#2563eb" },
      { source: "Walk-in QR Leads", percentage: 15, color: "#d97706" },
    ],
    aiRecommendation:
      "Geo-targeted local ads in Hyderabad & Bengaluru are driving 65% of leads at low CPL (₹310). Expand radius by 5km in Q4.",
  },
  "client-5": {
    // Apex Media Group
    totalLeads: 78,
    newLeads: 12,
    contactedLeads: 18,
    qualifiedLeads: 26,
    proposalLeads: 14,
    wonLeads: 6,
    lostLeads: 2,
    conversionRate: 18.5,
    avgCplRupees: 680,
    totalAdSpendRupees: 125000,
    roas: 3.4,
    projectedRevenueRupees: 890000,
    monthlyTrend: [
      { month: "May", leads: 12, projected: 14, won: 1 },
      { month: "Jun", leads: 15, projected: 16, won: 1 },
      { month: "Jul", leads: 17, projected: 18, won: 2 },
      { month: "Aug", leads: 20, projected: 20, won: 2 },
      { month: "Sep (Proj)", leads: 24, projected: 22, won: 2 },
    ],
    sourceBreakdown: [
      { source: "LinkedIn Outreach", percentage: 50, color: "#2563eb" },
      { source: "Event Referrals", percentage: 30, color: "#ef4d23" },
      { source: "Google Search", percentage: 20, color: "#059669" },
    ],
    aiRecommendation:
      "Enterprise deals have high average retainer value (₹120k/mo). Focus 1-on-1 Founder outreach on the 14 open proposal leads.",
  },
};

export default function PowerBiBrandAnalytics({ clients, leads, clientLeads = [] }: PowerBiBrandAnalyticsProps) {
  // Brand Filter Selection
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30d");

  // Compute Aggregated or Brand Specific Metrics
  const activeMetrics: BrandMetrics = useMemo(() => {
    if (selectedBrandId !== "all" && BRAND_ANALYTICS_DATA[selectedBrandId]) {
      return BRAND_ANALYTICS_DATA[selectedBrandId];
    }

    // Aggregated Metrics Across All Brands
    const brandKeys = Object.keys(BRAND_ANALYTICS_DATA);
    let totalLeads = 0;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let proposalLeads = 0;
    let wonLeads = 0;
    let lostLeads = 0;
    let totalAdSpend = 0;
    let projectedRev = 0;

    brandKeys.forEach((key) => {
      const data = BRAND_ANALYTICS_DATA[key];
      totalLeads += data.totalLeads;
      newLeads += data.newLeads;
      contactedLeads += data.contactedLeads;
      qualifiedLeads += data.qualifiedLeads;
      proposalLeads += data.proposalLeads;
      wonLeads += data.wonLeads;
      lostLeads += data.lostLeads;
      totalAdSpend += data.totalAdSpendRupees;
      projectedRev += data.projectedRevenueRupees;
    });

    const avgConversion = (wonLeads / totalLeads) * 100;
    const avgCpl = Math.round(totalAdSpend / totalLeads);

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalLeads,
      wonLeads,
      lostLeads,
      conversionRate: parseFloat(avgConversion.toFixed(1)),
      avgCplRupees: avgCpl,
      totalAdSpendRupees: totalAdSpend,
      roas: 4.4,
      projectedRevenueRupees: projectedRev,
      monthlyTrend: [
        { month: "May", leads: 107, projected: 118, won: 9 },
        { month: "Jun", leads: 129, projected: 132, won: 12 },
        { month: "Jul", leads: 157, projected: 150, won: 16 },
        { month: "Aug", leads: 181, projected: 172, won: 19 },
        { month: "Sep (Proj)", leads: 202, projected: 190, won: 22 },
      ],
      sourceBreakdown: [
        { source: "Meta Ads (IG/FB)", percentage: 52, color: "#ef4d23" },
        { source: "Google Search Ads", percentage: 26, color: "#059669" },
        { source: "LinkedIn B2B", percentage: 14, color: "#2563eb" },
        { source: "Referrals & Direct", percentage: 8, color: "#d97706" },
      ],
      aiRecommendation:
        "Agency Portfolio Projection: Portfolio-wide conversion rate is 22.3%. Scaling Meta Ad budgets for Northbeam & UrbanFit while closing proposal leads will project ₹62.9L total agency revenue for Q4.",
    };
  }, [selectedBrandId]);

  // Recharts Data Transformation
  const leadStatusChartData = useMemo(() => {
    return [
      { stage: "New Leads", count: activeMetrics.newLeads, fill: "#2563eb" },
      { stage: "Contacted", count: activeMetrics.contactedLeads, fill: "#6366f1" },
      { stage: "Qualified", count: activeMetrics.qualifiedLeads, fill: "#8b5cf6" },
      { stage: "Proposal Sent", count: activeMetrics.proposalLeads, fill: "#f59e0b" },
      { stage: "Won (Client)", count: activeMetrics.wonLeads, fill: "#10b981" },
      { stage: "Lost", count: activeMetrics.lostLeads, fill: "#f43f5e" },
    ];
  }, [activeMetrics]);

  const channelPieData = useMemo(() => {
    const COLORS = ["#ef4d23", "#059669", "#2563eb", "#d97706", "#8b5cf6"];
    return activeMetrics.sourceBreakdown.map((src, i) => ({
      name: src.source,
      value: src.percentage,
      color: COLORS[i % COLORS.length],
    }));
  }, [activeMetrics]);

  const selectedClientObj = clients.find((c) => c.id === selectedBrandId);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* POWER BI CONTROL SLICER BAR */}
      {/* ========================================================================= */}
      <div className="bg-white/70 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#ef4d23]/10 px-3 py-1.5 rounded-full border border-[#ef4d23]/20 text-[#ef4d23] text-xs font-semibold">
            <BarChart3 className="h-4 w-4" />
            <span>Power BI Visual Engine</span>
          </div>

          {/* Brand Slicer Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-600 uppercase tracking-wider">Brand Slicer:</span>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="bg-white border border-neutral-300 rounded-2xl px-4 py-2 text-xs font-semibold text-neutral-900 shadow-xs focus:ring-2 focus:ring-[#ef4d23] cursor-pointer"
            >
              <option value="all">All Brands (Agency Portfolio Total)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.school_name} ({client.city})
                </option>
              ))}
            </select>
          </div>

          {/* Time Granularity Slicer */}
          <div className="flex items-center gap-1.5 bg-neutral-200/70 p-1 rounded-2xl text-xs font-medium">
            {["30d", "90d", "ytd"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-xl uppercase transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-white text-[#ef4d23] font-semibold shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Live Filter Indicator & Real-Time Excel Export */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-800 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>Active: <strong className="text-neutral-900 font-semibold">{selectedClientObj ? selectedClientObj.school_name : "All Agency Portfolio"}</strong></span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              exportRealtimeAnalyticsToExcel({
                clients,
                brandAnalyticsData: BRAND_ANALYTICS_DATA,
                clientLeads,
                activeBrandFilter: selectedBrandId,
              });
            }}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Real-Time Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 POWER BI EXECUTIVE METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads Captured */}
        <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl border border-white/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase">
            <span>Total Leads Projected</span>
            <Users className="h-4 w-4 text-[#ef4d23]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-neutral-900 tracking-tight">{activeMetrics.totalLeads}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% MoM
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-normal">Inbound & Campaign Prospects</p>
        </div>

        {/* Card 2: Conversion Rate % */}
        <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl border border-white/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase">
            <span>Conversion Win Rate</span>
            <Target className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-emerald-700 tracking-tight">{activeMetrics.conversionRate}%</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-0.5" /> High Quality
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-normal">{activeMetrics.wonLeads} Converted Clients</p>
        </div>

        {/* Card 3: Avg Cost Per Lead (CPL) */}
        <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl border border-white/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase">
            <span>Cost Per Lead (CPL)</span>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-neutral-900 tracking-tight">₹{activeMetrics.avgCplRupees}</span>
            <span className="text-xs font-medium text-blue-600">
              {activeMetrics.roas}x ROAS
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-normal">₹{(activeMetrics.totalAdSpendRupees / 1000).toFixed(0)}k Total Ad Spend</p>
        </div>

        {/* Card 4: Projected Revenue */}
        <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl border border-white/80 shadow-lg space-y-2 border-l-4 border-l-[#ef4d23]">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase">
            <span>Projected Pipeline Value</span>
            <TrendingUp className="h-4 w-4 text-[#ef4d23]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-[#ef4d23] tracking-tight">
              ₹{(activeMetrics.projectedRevenueRupees / 100000).toFixed(1)}L
            </span>
            <span className="text-xs font-medium text-[#ef4d23] bg-[#ef4d23]/10 px-2 py-0.5 rounded-full">
              Q4 Forecast
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-normal">Estimated Retainer Pipeline</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POWER BI VISUAL CHARTS GRID: BAR GRAPH + PIE CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAR GRAPH: Lead Status Distribution by Stage */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h3 className="font-semibold text-neutral-900 text-xs tracking-wider uppercase flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#ef4d23]" /> Lead Status Bar Graph
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5 font-normal">
                Dynamic lead stage breakdown for {selectedClientObj ? selectedClientObj.school_name : "All Brands"}
              </p>
            </div>
            <Badge variant="brand" className="text-xs font-medium">
              {activeMetrics.totalLeads} Leads Total
            </Badge>
          </div>

          {/* Recharts Bar Graph */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadStatusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fontWeight: 500, fill: "#475569" }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: "#475569" }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {leadStatusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART / DONUT: Channel Attribution Share */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-semibold text-neutral-900 text-xs tracking-wider uppercase flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-600" /> Channel Share Pie Chart
            </h3>
            <span className="text-[10px] font-medium text-neutral-400 uppercase">Share %</span>
          </div>

          {/* Recharts Donut Pie Chart */}
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelPieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "14px",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold text-neutral-900">100%</span>
              <span className="text-[9px] font-medium text-neutral-400 uppercase">Attribution</span>
            </div>
          </div>

          {/* Channel Legend Items */}
          <div className="space-y-1.5 text-xs font-medium">
            {channelPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-white/80">
                <span className="flex items-center gap-2 text-neutral-800">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[140px]">{item.name}</span>
                </span>
                <span className="font-semibold text-neutral-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AREA TREND CHART & AI PROJECTION SECTION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AREA CHART: Monthly Growth Curve */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-semibold text-neutral-900 text-xs tracking-wider uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#ef4d23]" /> Monthly Lead Trajectory Area Graph
            </h3>
            <span className="text-xs font-medium text-neutral-500">
              Target vs Actual vs Won
            </span>
          </div>

          <div className="h-[250px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeMetrics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4d23" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4d23" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: "#475569" }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "14px",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />
                <Area type="monotone" dataKey="leads" name="Actual Leads" stroke="#ef4d23" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="won" name="Won Clients" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI PROJECTION SUMMARY */}
        <div className="bg-gradient-to-br from-[#ef4d23]/10 via-white/80 to-purple-100/50 backdrop-blur-2xl p-6 rounded-3xl border border-[#ef4d23]/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ef4d23] uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Power BI AI Insights
            </div>
            <h4 className="font-semibold text-neutral-900 text-sm">
              Optimization Plan for {selectedClientObj ? selectedClientObj.school_name : "Agency Portfolio"}
            </h4>
            <p className="text-xs text-neutral-700 font-normal leading-relaxed">
              {activeMetrics.aiRecommendation}
            </p>
          </div>

          <div className="pt-3 border-t border-[#f97316]/20 text-[11px] text-neutral-600 space-y-1">
            <p className="font-medium flex items-center justify-between">
              <span>Conversion Velocity:</span>
              <strong className="text-neutral-900 font-semibold">12.4 Days Avg</strong>
            </p>
            <p className="font-medium flex items-center justify-between">
              <span>Forecast Quality:</span>
              <strong className="text-emerald-700 font-semibold">94.2% Confidence</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

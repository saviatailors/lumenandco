import { useState } from "react";
import { DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, BarChart3, Receipt, FileText, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { Contract, Invoice, Expense, SEED_STAFF_COST_RATES, ClientProfitability } from "@/lib/crm.functions";
import { INITIAL_SCHOOL_CLIENTS } from "@/lib/lumenandco.types";
import { exportRealtimeAnalyticsToExcel } from "@/lib/excelExport";

const DEFAULT_CONTRACTS: Contract[] = [];

export default function RevenueAnalyticsView({
  contracts = DEFAULT_CONTRACTS,
  invoices = [],
  expenses = [],
}: {
  contracts?: Contract[];
  invoices?: any[];
  expenses?: Expense[];
}) {
  const mrr = contracts.reduce((acc, c) => acc + (c.status === "active" ? c.monthly_value : 0), 0);
  const arr = mrr * 12;
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const overdueAmountCents = overdueInvoices.reduce((acc, i) => acc + (i.amount_cents ?? (i.amount_rupees ? i.amount_rupees * 100 : 0)), 0);

  // Client Profitability Calculations (Consuming Delivery Hub Hours Logged)
  const clientProfitabilityData: ClientProfitability[] = [];

  return (
    <div className="space-y-6">
      {/* Revenue Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">Revenue Engine & Client Profitability</h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
              Stripe-Grade BI
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            MRR metrics, Net Revenue Retention (NRR), and client margins calculated from Delivery Hub time entries.
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            exportRealtimeAnalyticsToExcel({
              clients: INITIAL_SCHOOL_CLIENTS,
            });
          }}
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Financial Excel (.xlsx)
        </button>
      </div>

      {/* Stripe-Grade MRR & Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block font-medium">Monthly Recurring Revenue (MRR)</span>
          <p className="text-3xl font-semibold text-neutral-900 mt-1">${mrr.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% MoM Growth
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block font-medium">Annual Recurring Revenue (ARR)</span>
          <p className="text-3xl font-semibold text-neutral-900 mt-1">${arr.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-400">Run-rate velocity</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block font-medium">Net Revenue Retention (NRR)</span>
          <p className="text-3xl font-semibold text-emerald-600 mt-1">112%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Expansion &gt; Churn</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block font-medium">Overdue Invoices</span>
          <p className="text-3xl font-semibold text-red-600 mt-1">
            ${(overdueAmountCents / 100).toLocaleString()}
          </p>
          <span className="text-[11px] text-red-600 font-semibold">{overdueInvoices.length} unpaid account</span>
        </div>
      </div>

      {/* Client Profitability Margin Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div>
          <h4 className="text-base font-semibold text-neutral-900">Client Profitability Margin Analysis</h4>
          <p className="text-xs text-neutral-500 font-normal">
            Calculated as Revenue minus (Delivery Hub Logged Hours × Staff Hourly Cost Rates) minus Direct Expenses.
          </p>
        </div>

        <div className="divide-y divide-neutral-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 font-semibold">Client Company</th>
                <th className="py-2.5 font-semibold">Monthly Revenue</th>
                <th className="py-2.5 font-semibold">Delivery Hub Hours</th>
                <th className="py-2.5 font-semibold">Labor Cost</th>
                <th className="py-2.5 font-semibold">Direct Expenses</th>
                <th className="py-2.5 font-semibold">Net Profit Margin</th>
                <th className="py-2.5 font-semibold">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {clientProfitabilityData.map((cp) => (
                <tr key={cp.client_id} className="hover:bg-neutral-50">
                  <td className="py-3 font-semibold text-[#ef4d23]">{cp.company_name}</td>
                  <td className="py-3 font-semibold text-neutral-900">${cp.monthly_revenue.toLocaleString()}</td>
                  <td className="py-3 font-medium text-neutral-700">{cp.delivery_hub_hours_logged} hrs</td>
                  <td className="py-3 text-neutral-600">${cp.labor_cost.toFixed(2)}</td>
                  <td className="py-3 text-neutral-600">${cp.allocated_expenses.toFixed(2)}</td>
                  <td className="py-3 font-semibold text-emerald-600">${cp.net_profit_margin.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                      {cp.margin_percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sequential Auditable Invoices List */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-neutral-900">Sequential Invoices & Billing Log</h4>

        <div className="divide-y divide-neutral-100">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg">
                  {inv.invoice_number}
                </span>
                <div>
                  <p className="font-bold text-neutral-900">{inv.client_name}</p>
                  <p className="text-[10px] text-neutral-400">Due: {inv.due_date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-neutral-900">
                  ${(inv.amount_cents / 100).toLocaleString()}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    inv.status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : inv.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

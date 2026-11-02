'use client';

import React from 'react';
import { EmployerShell } from '@/components/employer/EmployerShell';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Clock, Users, ShieldCheck, TrendingUp } from 'lucide-react';

export default function EmployerAnalyticsPage() {
  const levelDistribution = [
    { name: 'Gold (70-100)', value: 6, color: '#F5A623' },
    { name: 'Silver (40-69)', value: 4, color: '#8A94A6' },
    { name: 'Bronze (0-39)', value: 2, color: '#B87333' },
  ];

  const localityDemandSupply = [
    { locality: 'Whitefield', demand: 28, supply: 19 },
    { locality: 'Koramangala', demand: 22, supply: 16 },
    { locality: 'HSR Layout', demand: 18, supply: 12 },
    { locality: 'Jayanagar', demand: 15, supply: 10 },
    { locality: 'Electronic City', demand: 19, supply: 14 },
  ];

  return (
    <EmployerShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-navy-primary tracking-tight">
            Workforce Verification & Demand Analytics
          </h1>
          <p className="text-xs text-content-secondary">
            Real-time talent metrics and hiring efficiency telemetry across Bengaluru
          </p>
        </div>

        {/* Top 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-light text-orange flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-medium">Verification Time Saved</p>
              <h3 className="text-2xl font-black text-navy-primary">4.2 Days</h3>
              <p className="text-[10px] text-green-dark font-bold mt-0.5">↓ 72% faster onboarding</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-tint text-green flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-medium">Verified Workers</p>
              <h3 className="text-2xl font-black text-navy-primary">100%</h3>
              <p className="text-[10px] text-green-dark font-bold mt-0.5">Vouch & Evidence audited</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-primary/5 text-navy-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-medium">Available in Bengaluru</p>
              <h3 className="text-2xl font-black text-navy-primary">12 Active</h3>
              <p className="text-[10px] text-navy-primary/80 font-bold mt-0.5">Electricians & Plumbers</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-medium">Interview Conversion</p>
              <h3 className="text-2xl font-black text-navy-primary">94.8%</h3>
              <p className="text-[10px] text-green-dark font-bold mt-0.5">Zero mismatch disputes</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Locality Demand vs Supply Bar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-navy-primary">
                  Locality Demand vs Verified Supply
                </h3>
                <p className="text-xs text-content-secondary">
                  Open contractor requirements vs active certified talent
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-navy-primary">
                  <span className="w-3 h-3 rounded-sm bg-navy-primary inline-block"></span> Demand
                </span>
                <span className="flex items-center gap-1.5 text-orange">
                  <span className="w-3 h-3 rounded-sm bg-orange inline-block"></span> Verified Supply
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={localityDemandSupply}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="locality" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="demand" fill="#0B2A5B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="supply" fill="#F47B20" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Level Distribution Pie Chart */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-primary">
                Talent Tier Distribution
              </h3>
              <p className="text-xs text-content-secondary">
                Breakdown by Gold, Silver, and Bronze badges
              </p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {levelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs text-content-secondary text-center font-medium">
              50% of registered technicians hold Gold Tier verification (70+ Trust Score)
            </div>
          </div>

        </div>
      </div>
    </EmployerShell>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
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
import { Clock, Users, ShieldCheck, TrendingUp, ArrowLeft } from 'lucide-react';

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
        {/* Top Header with Physical Back Button (Requirement 7) */}
        <div className="flex items-center gap-3">
          <Link
            href="/employer"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy-primary shadow-xs transition-colors shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-navy-primary tracking-tight">
              Workforce Verification & Demand Analytics
            </h1>
            <p className="text-xs text-content-secondary">
              Real-time talent metrics and hiring efficiency telemetry across Bengaluru
            </p>
          </div>
        </div>

        {/* Top 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-light text-orange flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-semibold">Avg. Hiring Time</p>
              <h3 className="text-2xl font-black text-navy-primary mt-0.5">3.2 Hrs</h3>
              <p className="text-[10px] text-green font-bold">↓ 82% vs traditional agencies</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-tint text-green flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-semibold">Verification Accuracy</p>
              <h3 className="text-2xl font-black text-navy-primary mt-0.5">99.4%</h3>
              <p className="text-[10px] text-green font-bold">Dual-tier phone OTP stamped</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-navy-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-semibold">Verified Workers Active</p>
              <h3 className="text-2xl font-black text-navy-primary mt-0.5">12</h3>
              <p className="text-[10px] text-slate-400 font-bold">Bengaluru Metro Cluster</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-content-secondary font-semibold">Worker Wage Uplift</p>
              <h3 className="text-2xl font-black text-navy-primary mt-0.5">+24.8%</h3>
              <p className="text-[10px] text-orange font-bold">Average earnings improvement</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Locality Supply vs Demand Bar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-primary">
                Locality Demand vs. Verified Supply (Bengaluru)
              </h3>
              <p className="text-xs text-content-secondary">
                Electrician & Plumber job postings vs verified workers registered
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={localityDemandSupply}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="locality" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B2A5B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="demand" name="Employer Openings" fill="#F47B20" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="supply" name="Verified Workers" fill="#0B2A5B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badge Level Distribution Donut */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-primary">
                Talent Tier Distribution
              </h3>
              <p className="text-xs text-content-secondary">
                Breakdown of active talent by Merit Badge Level
              </p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {levelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B2A5B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </EmployerShell>
  );
}

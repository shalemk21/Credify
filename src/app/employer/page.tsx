'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  Phone,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  X,
  GitCompare
} from 'lucide-react';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { MatchRing } from '@/components/shared/MatchRing';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/shared/Button';
import { calculateMatchScore } from '@/lib/match';
import { INITIAL_WORKERS } from '@/lib/db';
import { WorkerProfile, Trade, BengaluruLocality } from '@/types';

export default function EmployerDashboardPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ELECTRICIAN');
  const [selectedLocality, setSelectedLocality] = useState<BengaluruLocality>('Whitefield');
  const [minScore, setMinScore] = useState<string>('50');
  const [safetyFilter, setSafetyFilter] = useState<boolean>(false);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['worker-ramesh-k']);
  const [compareIds, setCompareIds] = useState<string[]>(['worker-ramesh-k', 'worker-shankar-m']);

  // Selected worker for Match Breakdown (default Ramesh K.)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-ramesh-k');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Hire request modal state
  const [hireModalWorker, setHireModalWorker] = useState<WorkerProfile | null>(null);
  const [hireDuration, setHireDuration] = useState('3 Days');
  const [hireDailyWage, setHireDailyWage] = useState('1200');
  const [hireSentSuccess, setHireSentSuccess] = useState(false);

  // Filter and rank workers
  const rankedWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        if (selectedTrade && w.trade !== selectedTrade) return false;
        if (safetyFilter && !w.safetyAware) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchSkill = w.declaredSkills.some((s) => s.toLowerCase().includes(term));
          const matchName = w.name.toLowerCase().includes(term);
          const matchLoc = w.locality.toLowerCase().includes(term);
          if (!matchSkill && !matchName && !matchLoc) return false;
        }
        return true;
      })
      .map((worker) => {
        const matchData = calculateMatchScore(worker, {
          trade: selectedTrade as Trade,
          employerLocality: selectedLocality,
          minExperienceYears: 4,
          minTrustScore: parseInt(minScore || '0', 10),
        });
        return { worker, matchData };
      })
      .filter(({ matchData }) => {
        if (minScore && matchData.overallMatchScore < parseInt(minScore, 10)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchData.overallMatchScore - a.matchData.overallMatchScore);
  }, [workers, selectedTrade, selectedLocality, minScore, safetyFilter, searchTerm]);

  const activeWorkerData = useMemo(() => {
    const found = rankedWorkers.find((item) => item.worker.id === selectedWorkerId);
    if (found) return found;
    return rankedWorkers[0] || null;
  }, [rankedWorkers, selectedWorkerId]);

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShortlistedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare at most 3 workers at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSendHireRequest = () => {
    setHireSentSuccess(true);
    setTimeout(() => {
      setHireSentSuccess(false);
      setHireModalWorker(null);
    }, 1800);
  };

  return (
    <EmployerShell>
      <div className="space-y-6">
        
        {/* Filter Bar (matches Screen 5 in showcase image) */}
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by skill, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-primary/20 text-navy-primary font-medium"
            />
          </div>

          {/* Trade Dropdown */}
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20 cursor-pointer"
          >
            <option value="ELECTRICIAN">Electrician</option>
            <option value="PLUMBER">Plumber</option>
          </select>

          {/* Locality Dropdown */}
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value as BengaluruLocality)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20 cursor-pointer"
          >
            <option value="Whitefield">Whitefield</option>
            <option value="Koramangala">Koramangala</option>
            <option value="HSR Layout">HSR Layout</option>
            <option value="Jayanagar">Jayanagar</option>
            <option value="Indiranagar">Indiranagar</option>
            <option value="Electronic City">Electronic City</option>
          </select>

          {/* Min Score Input */}
          <div className="w-28 flex items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400 font-semibold mr-1.5">Min:</span>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Score"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-navy-primary focus:outline-none"
            />
          </div>

          {/* Search Button (Navy button) */}
          <Button variant="primary" size="md" className="shrink-0 px-6 font-bold">
            Search
          </Button>

        </div>

        {/* Comparison Bar Pill if candidates selected */}
        {compareIds.length > 0 && (
          <div className="bg-navy-deep text-white p-3 rounded-2xl flex items-center justify-between shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <GitCompare className="w-4 h-4 text-orange" />
              <span>{compareIds.length} worker{compareIds.length > 1 ? 's' : ''} selected for comparison</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-slate-300 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <Button href="/employer/compare" variant="orange" size="sm">
                Compare Side-by-Side →
              </Button>
            </div>
          </div>
        )}

        {/* Two-Column Body (matches Screen 5 in showcase image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Ranked Worker Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-content-secondary px-1">
              <span className="font-bold text-navy-primary">
                {rankedWorkers.length} Verified Workers Matched
              </span>
              <span className="text-slate-400">
                Sorted by AI Explainable Match Score
              </span>
            </div>

            {rankedWorkers.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
                <p className="text-content-secondary font-medium">No workers matched your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setMinScore('30');
                    setSearchTerm('');
                  }}
                  className="mt-2 text-sm text-orange font-bold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              rankedWorkers.map(({ worker, matchData }) => {
                const isSelected = activeWorkerData?.worker.id === worker.id;
                const isShortlisted = shortlistedIds.includes(worker.id);
                const isCompared = compareIds.includes(worker.id);

                return (
                  <div
                    key={worker.id}
                    onClick={() => {
                      setSelectedWorkerId(worker.id);
                      if (window.innerWidth < 1024) {
                        setMobileSheetOpen(true);
                      }
                    }}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-navy-primary ring-2 ring-navy-primary/10 shadow-card-hover bg-slate-50/30'
                        : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Avatar & Worker Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={worker.avatarUrl}
                            alt={worker.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                          />
                          {worker.safetyAware && (
                            <span
                              title="Safety Aware Certified"
                              className="absolute -bottom-1 -right-1 bg-green text-white p-0.5 rounded-full ring-2 ring-white"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-extrabold text-navy-primary truncate">
                              {worker.name}
                            </h3>
                            <BadgeLevel level={worker.badgeLevel} size="sm" />
                          </div>

                          <p className="text-xs text-content-secondary truncate mt-0.5 font-medium">
                            {worker.trade === 'ELECTRICIAN' ? 'Electrician' : 'Plumber'} • {worker.locality}, Bengaluru
                          </p>

                          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                            <span>{worker.yearsOfExperience} yrs</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-orange" />
                              {matchData.distanceKm} km
                            </span>
                            <span>•</span>
                            <span>{worker.vouches.length} vouches</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Circular MatchRing (matches Screen 5 in showcase) */}
                      <div className="flex items-center gap-3 shrink-0">
                        <MatchRing score={matchData.overallMatchScore} size={64} />
                      </div>
                    </div>

                    {/* Quick action bar */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleShortlist(worker.id, e)}
                          className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                            isShortlisted
                              ? 'bg-orange-light text-orange border-orange/30 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                          title="Shortlist candidate"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-orange' : ''}`} />
                          <span className="hidden sm:inline">{isShortlisted ? 'Saved' : 'Shortlist'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => toggleCompare(worker.id, e)}
                          className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                            isCompared
                              ? 'bg-navy-primary text-white border-navy-primary font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                          title="Compare side-by-side"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/passport/${worker.id}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="text-navy-primary font-bold hover:underline flex items-center gap-0.5 text-xs py-1 px-2"
                        >
                          <span>Passport</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setHireModalWorker(worker);
                          }}
                          className="bg-orange hover:bg-orange-hover text-white px-3 py-1.5 rounded-xl font-bold transition-colors shadow-button flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Hire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Sticky "Match Breakdown" Panel (matches Screen 5 in showcase) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20">
            {activeWorkerData ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-navy-primary tracking-tight">
                      Match Breakdown
                    </h2>
                    <p className="text-xs text-content-secondary">
                      Multi-factor merit & verification breakdown
                    </p>
                  </div>
                  <BadgeLevel level={activeWorkerData.worker.badgeLevel} size="md" />
                </div>

                {/* Progress Bars (matches Screen 5 progress bars) */}
                <div className="space-y-4">
                  <ProgressBar
                    label="Skills Match"
                    value={activeWorkerData.matchData.skillsMatch}
                    color="green"
                  />
                  <ProgressBar
                    label="Experience"
                    value={activeWorkerData.matchData.experienceMatch}
                    color="navy"
                  />
                  <ProgressBar
                    label="Location"
                    value={activeWorkerData.matchData.locationMatch}
                    color="navy"
                  />
                  <ProgressBar
                    label="Trust Score"
                    value={activeWorkerData.matchData.trustScoreMatch}
                    color="navy"
                  />
                </div>

                {/* Green "Verified Profile" Card (matches Screen 5 card) */}
                <div className="bg-green-tint border border-green/30 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-green-dark">
                      Verified Profile
                    </h4>
                    <p className="text-xs text-green-dark/90 mt-0.5 font-medium leading-relaxed">
                      With {activeWorkerData.worker.vouches.length} vouches & {activeWorkerData.worker.evidence.length} verified work evidence items.
                    </p>
                  </div>
                </div>

                {/* Explainable AI summary */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-content-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 text-navy-primary font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange" />
                    <span>Explainable Match Justification:</span>
                  </div>
                  <p>{activeWorkerData.matchData.oneLineExplanation}</p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <Button
                    onClick={() => setHireModalWorker(activeWorkerData.worker)}
                    variant="orange"
                    fullWidth
                    size="lg"
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send Hire Request
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      href={`/passport/${activeWorkerData.worker.id}`}
                      variant="outline"
                      size="md"
                      icon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Full Passport
                    </Button>
                    <a
                      href={`https://wa.me/?text=Hi%20${encodeURIComponent(activeWorkerData.worker.name)},%20we%20found%20your%20verified%20SkillPassport%20via%20Credify%20and%20would%20like%20to%20discuss%20an%20opportunity.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center font-bold text-xs rounded-2xl border border-slate-300 hover:bg-slate-50 text-navy-primary py-2.5 px-3 gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-green" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400">
                Select a worker card to view match breakdown
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Bottom Sheet for Match Breakdown (matches responsive spec) */}
      {mobileSheetOpen && activeWorkerData && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-5 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-navy-primary">
                  {activeWorkerData.worker.name} — Match Breakdown
                </h3>
                <p className="text-xs text-content-secondary">
                  {activeWorkerData.matchData.overallMatchScore}% Overall Match
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <ProgressBar label="Skills Match" value={activeWorkerData.matchData.skillsMatch} color="green" />
              <ProgressBar label="Experience" value={activeWorkerData.matchData.experienceMatch} color="navy" />
              <ProgressBar label="Location" value={activeWorkerData.matchData.locationMatch} color="navy" />
              <ProgressBar label="Trust Score" value={activeWorkerData.matchData.trustScoreMatch} color="navy" />
            </div>

            <div className="bg-green-tint border border-green/30 rounded-2xl p-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green shrink-0" />
              <div className="text-xs text-green-dark font-medium">
                Verified Profile with {activeWorkerData.worker.vouches.length} vouches & evidence.
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => {
                  setMobileSheetOpen(false);
                  setHireModalWorker(activeWorkerData.worker);
                }}
                variant="orange"
                fullWidth
              >
                Send Hire Request
              </Button>
              <Button
                href={`/passport/${activeWorkerData.worker.id}`}
                variant="outline"
                fullWidth
              >
                View Full Passport
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hire Request Modal */}
      {hireModalWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-navy-primary">
                  Send Hire Request
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Direct inquiry to {hireModalWorker.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHireModalWorker(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {hireSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-green text-white mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-extrabold text-navy-primary">
                  Request Sent Successfully!
                </h4>
                <p className="text-xs text-content-secondary">
                  Worker will receive a notification in their &quot;Jobs for you&quot; tab.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-semibold text-navy-primary">
                <div>
                  <label className="block mb-1 text-slate-500">Duration</label>
                  <select
                    value={hireDuration}
                    onChange={(e) => setHireDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="1 Day (Emergency)">1 Day (Emergency)</option>
                    <option value="3 Days">3 Days</option>
                    <option value="1 Week">1 Week</option>
                    <option value="Monthly Contract">Monthly Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Daily Wage Offer (₹)</label>
                  <input
                    type="number"
                    value={hireDailyWage}
                    onChange={(e) => setHireDailyWage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Recommended daily rate for {hireModalWorker.badgeLevel} {hireModalWorker.trade}: ₹1,100 - ₹1,400</p>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Project / Site Location</label>
                  <input
                    type="text"
                    defaultValue={`${selectedLocality}, Bengaluru`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    onClick={() => setHireModalWorker(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendHireRequest}
                    variant="orange"
                    className="flex-1 font-bold"
                  >
                    Confirm & Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </EmployerShell>
  );
}

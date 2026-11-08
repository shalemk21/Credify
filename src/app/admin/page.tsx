'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { db } from '@/lib/db';
import { WorkerProfile, Vouch, EmployerProfile, JobRequest } from '@/types';
import { calculateTrustScore } from '@/lib/trust';
import { getStoredUser, clearStoredUser, DEMO_ACCOUNTS, AuthUser } from '@/lib/auth';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  LayoutDashboard,
  ExternalLink,
  Trash2,
  ShieldAlert,
  MessageSquareX,
  X,
  Star,
  UserX,
  AlertTriangle,
  LogOut,
  Building2,
  Briefcase,
  Users,
  Clock,
  XCircle,
  MapPin,
  Check,
  Send,
  Database as DbIcon
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'employers' | 'jobs' | 'workers'>('employers');

  // Database Data States
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [jobs, setJobs] = useState<JobRequest[]>([]);

  // Status notice
  const [statusNotice, setStatusNotice] = useState<string>('');
  const [currentAdmin, setCurrentAdmin] = useState<AuthUser | null>(null);
  
  // Vouch Moderation modal state
  const [moderatingWorker, setModeratingWorker] = useState<WorkerProfile | null>(null);

  // Delete confirmation modal state
  const [deletingWorker, setDeletingWorker] = useState<WorkerProfile | null>(null);

  // Rejection modal state for employer or job application
  const [rejectionModal, setRejectionModal] = useState<{
    type: 'employer' | 'job';
    id: string;
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Initialize from database & auth user
  useEffect(() => {
    refreshData();
    const user = getStoredUser();
    if (user && user.role === 'admin') {
      setCurrentAdmin(user);
    } else {
      // Default to Directorate demo profile
      setCurrentAdmin({
        id: DEMO_ACCOUNTS.admin.id,
        role: 'admin',
        name: DEMO_ACCOUNTS.admin.name,
        email: DEMO_ACCOUNTS.admin.email,
        phone: DEMO_ACCOUNTS.admin.phone,
        organization: DEMO_ACCOUNTS.admin.organization,
        designation: DEMO_ACCOUNTS.admin.designation,
        avatar: DEMO_ACCOUNTS.admin.avatar,
        loginTime: new Date().toISOString(),
      });
    }
  }, []);

  const refreshData = () => {
    setWorkers(db.getWorkers());
    setEmployers(db.getEmployers());
    setJobs(db.getJobs());
  };

  const adminName = currentAdmin?.name || 'Dr. Sunita Rao (Directorate)';

  // --- Employer Approval Actions ---
  const handleApproveEmployer = (employerId: string) => {
    const updated = db.approveEmployer(employerId, adminName);
    if (updated) {
      setEmployers(db.getEmployers());
      setStatusNotice(`✅ Employer "${updated.companyName}" approved! Account and hiring privileges unlocked.`);
      setTimeout(() => setStatusNotice(''), 4000);
    }
  };

  const handleOpenRejectEmployer = (emp: EmployerProfile) => {
    setRejectionModal({
      type: 'employer',
      id: emp.id,
      title: `Employer Application: ${emp.companyName}`,
    });
    setRejectionReason('GSTIN or company documentation verification was inconclusive.');
  };

  // --- Job Approval Actions ---
  const handleApproveJob = (jobId: string) => {
    const updated = db.approveJob(jobId, adminName);
    if (updated) {
      setJobs(db.getJobs());
      setStatusNotice(`✅ Job Application "${jobId}" approved by Directorate and dispatched to candidate.`);
      setTimeout(() => setStatusNotice(''), 4000);
    }
  };

  const handleOpenRejectJob = (job: JobRequest) => {
    setRejectionModal({
      type: 'job',
      id: job.id,
      title: `Job Application: ${job.trade} (${job.employerName})`,
    });
    setRejectionReason('Wage offer is below Bengaluru fair-wage benchmark or scope is undefined.');
  };

  const handleConfirmRejection = () => {
    if (!rejectionModal) return;

    if (rejectionModal.type === 'employer') {
      const updated = db.rejectEmployer(rejectionModal.id, adminName, rejectionReason);
      if (updated) {
        setEmployers(db.getEmployers());
        setStatusNotice(`Employer application rejected with feedback logged to database.`);
      }
    } else {
      const updated = db.rejectJob(rejectionModal.id, adminName, rejectionReason);
      if (updated) {
        setJobs(db.getJobs());
        setStatusNotice(`Job request application rejected with feedback logged to database.`);
      }
    }

    setRejectionModal(null);
    setRejectionReason('');
    setTimeout(() => setStatusNotice(''), 4000);
  };

  // --- Worker Moderation Actions ---
  const toggleAssessor = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    const newStatus = !worker.assessorVerified;
    const scoreBreakdown = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: worker.vouches,
      assessment: worker.assessment,
      assessorVerified: newStatus,
    });

    const updated = db.updateWorker(workerId, {
      assessorVerified: newStatus,
      trustScore: scoreBreakdown.totalScore,
      badgeLevel: scoreBreakdown.badgeLevel,
    });

    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setStatusNotice(
        `Assessor endorsement ${newStatus ? 'GRANTED' : 'REVOKED'} for ${worker.name}. Trust score recalculated.`
      );
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const handleDeleteWorker = () => {
    if (!deletingWorker) return;
    const id = deletingWorker.id;
    const name = deletingWorker.name;
    const success = db.deleteWorker(id);
    if (success) {
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      setStatusNotice(`Worker profile for ${name} has been removed from database.`);
      setDeletingWorker(null);
      setTimeout(() => setStatusNotice(''), 3500);
    }
  };

  const handleRemoveVouch = (workerId: string, vouchId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    const updatedVouches = worker.vouches.filter((v) => v.id !== vouchId);
    const scoreBreakdown = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: updatedVouches,
      assessment: worker.assessment,
      assessorVerified: worker.assessorVerified,
    });

    const updated = db.updateWorker(workerId, {
      vouches: updatedVouches,
      trustScore: scoreBreakdown.totalScore,
      badgeLevel: scoreBreakdown.badgeLevel,
    });

    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setModeratingWorker(updated);
      setStatusNotice('Fraudulent/spam vouch removed and trust score recalculated in database.');
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const handleReset = () => {
    db.resetToDemo();
    refreshData();
    setStatusNotice('Database reset to pristine initial verified state.');
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push('/login?role=admin');
  };

  // Counts for pending applications
  const pendingEmployersCount = employers.filter(e => e.status === 'PENDING_APPROVAL').length;
  const pendingJobsCount = jobs.filter(j => !j.approvalStatus || j.approvalStatus === 'PENDING_ADMIN_APPROVAL').length;

  return (
    <div className="min-h-screen bg-canvas p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/employer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy-primary shadow-xs transition-colors"
              title="Return to Employer Dashboard"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <Logo size="md" href="/" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-navy-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                Admin Directorate
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-green-dark bg-green-tint px-2 py-0.5 rounded-full border border-green/20">
                <DbIcon className="w-3 h-3 text-green" />
                SQLite DB Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Authenticated Admin Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs">
              <div className="w-5 h-5 rounded-full bg-green text-white flex items-center justify-center font-bold text-[10px]">
                {currentAdmin?.avatar || 'SR'}
              </div>
              <span className="font-bold text-navy-primary">{currentAdmin?.name || 'Dr. Sunita Rao'}</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Trust Authority</span>
            </div>

            <Button href="/worker" variant="outline" size="sm" icon={<Smartphone className="w-4 h-4" />}>
              Worker PWA
            </Button>
            <Button href="/employer" variant="outline" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
              Employer View
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Seed
            </Button>
            <Button
              onClick={handleLogout}
              variant="orange"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Status Notice Banner */}
        {statusNotice && (
          <div className="bg-green-tint border border-green/30 text-green-dark p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Metric Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Pending Employers</span>
              <Building2 className="w-4 h-4 text-orange" />
            </div>
            <div className="text-2xl font-black text-navy-primary mt-1">
              {pendingEmployersCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {employers.length} total organizations
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Pending Job Requests</span>
              <Briefcase className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-navy-primary mt-1">
              {pendingJobsCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {jobs.length} total applications
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Registered Workers</span>
              <Users className="w-4 h-4 text-navy-primary" />
            </div>
            <div className="text-2xl font-black text-navy-primary mt-1">
              {workers.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {workers.filter(w => w.assessorVerified).length} Assessor Verified
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Database Engine</span>
              <DbIcon className="w-4 h-4 text-green" />
            </div>
            <div className="text-sm font-black text-navy-primary mt-1">
              SQLite (node:sqlite)
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              data/credify.db persistent
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('employers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'employers'
                ? 'bg-navy-primary text-white shadow-button-navy'
                : 'bg-white text-slate-600 hover:text-navy-primary border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Employer Applications</span>
            {pendingEmployersCount > 0 && (
              <span className="bg-orange text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {pendingEmployersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'jobs'
                ? 'bg-navy-primary text-white shadow-button-navy'
                : 'bg-white text-slate-600 hover:text-navy-primary border border-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Hire & Job Requests</span>
            {pendingJobsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {pendingJobsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'workers'
                ? 'bg-navy-primary text-white shadow-button-navy'
                : 'bg-white text-slate-600 hover:text-navy-primary border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Worker Registry & Trust</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {workers.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Employer Applications & Approvals */}
        {activeTab === 'employers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-navy-primary">
                  Employer Organization Applications
                </h2>
                <p className="text-xs text-content-secondary">
                  If an employer creates an account application, an admin must approve it before hiring permissions are granted.
                </p>
              </div>
              <Link
                href="/employer/register"
                className="text-xs font-bold text-orange hover:underline inline-flex items-center gap-1"
              >
                <span>+ Test Register New Employer Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Contact Person</th>
                    <th className="p-4">Locality & Type</th>
                    <th className="p-4">GSTIN & Reg</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employers.map((emp) => {
                    const isPending = emp.status === 'PENDING_APPROVAL';
                    const isApproved = emp.status === 'APPROVED';
                    const isRejected = emp.status === 'REJECTED';

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange/15 text-orange flex items-center justify-center font-black text-xs shrink-0">
                              {emp.companyName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-navy-primary text-sm">
                                {emp.companyName}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                ID: {emp.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-navy-primary">{emp.contactPerson || 'Authorized Rep'}</p>
                          <p className="text-[11px] text-slate-400">{emp.phone} {emp.email ? `• ${emp.email}` : ''}</p>
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-slate-700">{emp.locality}</p>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{emp.type || 'Contractor'}</span>
                        </td>

                        <td className="p-4">
                          <p className="font-mono font-bold text-navy-primary">{emp.gstin || 'None Provided'}</p>
                          <p className="text-[10px] text-slate-400">Verified via GST Portal</p>
                        </td>

                        <td className="p-4 text-slate-600 font-medium">
                          {emp.applicationDate}
                        </td>

                        <td className="p-4">
                          {isApproved && (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-tint text-green-dark border border-green/30 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                                <span>Approved</span>
                              </span>
                              {emp.approvedBy && (
                                <p className="text-[10px] text-slate-400 mt-0.5">by {emp.approvedBy}</p>
                              )}
                            </div>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Pending Review</span>
                            </span>
                          )}

                          {isRejected && (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                                <span>Rejected</span>
                              </span>
                              {emp.rejectionReason && (
                                <p className="text-[10px] text-red-500 mt-0.5 truncate max-w-[150px]" title={emp.rejectionReason}>
                                  {emp.rejectionReason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveEmployer(emp.id)}
                                  className="px-3 py-1.5 rounded-xl bg-green text-white hover:bg-green-dark font-extrabold text-xs transition-colors shadow-xs flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenRejectEmployer(emp)}
                                  className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => handleOpenRejectEmployer(emp)}
                                className="text-xs text-slate-400 hover:text-red-600 underline font-semibold"
                              >
                                Revoke Approval
                              </button>
                            )}

                            {isRejected && (
                              <button
                                type="button"
                                onClick={() => handleApproveEmployer(emp.id)}
                                className="text-xs text-green font-bold hover:underline"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Hire Requests & Job Applications */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-navy-primary">
                  Site Job & Hire Applications Review Queue
                </h2>
                <p className="text-xs text-content-secondary">
                  If an employer creates a job application or hire request, it must be approved by the admin before worker dispatch.
                </p>
              </div>
              <Link
                href="/employer/hire-requests"
                className="text-xs font-bold text-orange hover:underline inline-flex items-center gap-1"
              >
                <span>View Employer Hire Requests View →</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Employer</th>
                    <th className="p-4">Trade & Target Candidate</th>
                    <th className="p-4">Site Locality & Duration</th>
                    <th className="p-4">Wage Offer</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Directorate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => {
                    const isApproved = job.approvalStatus === 'APPROVED';
                    const isPending = !job.approvalStatus || job.approvalStatus === 'PENDING_ADMIN_APPROVAL';
                    const isRejected = job.approvalStatus === 'REJECTED';

                    return (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-navy-primary text-sm">
                            {job.employerName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ID: {job.id} • {job.createdAt}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {job.trade === 'ELECTRICIAN' ? '⚡' : '🔧'}
                            </span>
                            <div>
                              <p className="font-bold text-navy-primary">
                                {job.requiredWorkers}x {job.trade}
                              </p>
                              {job.targetWorkerName ? (
                                <p className="text-[11px] text-orange font-bold">
                                  Direct Target: {job.targetWorkerName}
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-400">
                                  Open broadcast pool
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange" />
                            {job.locality}
                          </p>
                          <p className="text-[11px] text-slate-400">{job.duration}</p>
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-navy-primary text-sm">
                            ₹{job.dailyWageOffer} / day
                          </p>
                          <span className="text-[10px] text-green font-bold bg-green-tint px-1.5 py-0.5 rounded">
                            Fair wage benchmark met
                          </span>
                        </td>

                        <td className="p-4">
                          {isApproved && (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-tint text-green-dark border border-green/30 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                                <span>Approved & Dispatched</span>
                              </span>
                              {job.approvedBy && (
                                <p className="text-[10px] text-slate-400 mt-0.5">by {job.approvedBy}</p>
                              )}
                            </div>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Requires Admin Approval</span>
                            </span>
                          )}

                          {isRejected && (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                                <span>Rejected</span>
                              </span>
                              {job.rejectionReason && (
                                <p className="text-[10px] text-red-500 mt-0.5 truncate max-w-[150px]" title={job.rejectionReason}>
                                  {job.rejectionReason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveJob(job.id)}
                                  className="px-3 py-1.5 rounded-xl bg-green text-white hover:bg-green-dark font-extrabold text-xs transition-colors shadow-xs flex items-center gap-1"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Approve & Dispatch</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenRejectJob(job)}
                                  className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => handleOpenRejectJob(job)}
                                className="text-xs text-slate-400 hover:text-red-600 underline font-semibold"
                              >
                                Revoke Approval
                              </button>
                            )}

                            {isRejected && (
                              <button
                                type="button"
                                onClick={() => handleApproveJob(job.id)}
                                className="text-xs text-green font-bold hover:underline"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: National Worker Registry & Trust Moderation */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-navy-primary">
                  National Skill Register — Worker Moderation
                </h2>
                <p className="text-xs text-content-secondary">
                  Toggle Assessor Verifications, audit peer vouches, or purge fraudulent accounts
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {workers.length} active worker profiles loaded from database
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Worker Profile</th>
                    <th className="p-4">Trade & Location</th>
                    <th className="p-4">Trust Score</th>
                    <th className="p-4">Tier Badge</th>
                    <th className="p-4">Assessor Verified</th>
                    <th className="p-4">Vouches Moderation</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={worker.avatarUrl}
                            alt={worker.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <p className="font-extrabold text-navy-primary text-sm">
                              {worker.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {worker.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-navy-primary">{worker.trade}</p>
                        <p className="text-[11px] text-slate-500">{worker.locality}, Bengaluru</p>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-sm text-navy-primary">
                          {worker.trustScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">/100</span>
                      </td>

                      <td className="p-4">
                        <BadgeLevel level={worker.badgeLevel} size="sm" />
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleAssessor(worker.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                            worker.assessorVerified
                              ? 'bg-green text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{worker.assessorVerified ? 'Assessor Verified (+20)' : 'Unverified (Click to Endorse)'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setModeratingWorker(worker)}
                            className="px-2.5 py-1 rounded-xl bg-navy-primary/5 hover:bg-navy-primary/10 text-navy-primary text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <span>{worker.vouches.length} Vouches</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/passport/${worker.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-primary hover:bg-slate-100"
                            title="View Public Passport"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeletingWorker(worker)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Remove Worker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Rejection Feedback Modal for Employer or Job Application */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-navy-primary">
                  Reject Application
                </h3>
                <p className="text-xs text-content-secondary truncate max-w-xs">
                  {rejectionModal.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-primary mb-1">
                Reason / Feedback for Rejection (Logged to Database)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State why this application was not approved..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium resize-none focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                onClick={() => setRejectionModal(null)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmRejection}
                variant="orange"
                className="flex-1 font-bold bg-red-600 hover:bg-red-700"
                size="sm"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Worker Modal */}
      {deletingWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy-primary text-base">Purge Worker Profile?</h3>
              <p className="text-xs text-content-secondary mt-1">
                This will delete <strong>{deletingWorker.name}</strong> from the database registry.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setDeletingWorker(null)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteWorker}
                variant="orange"
                className="flex-1 font-bold bg-red-600 hover:bg-red-700"
                size="sm"
              >
                Purge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Vouch Moderation Modal */}
      {moderatingWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-navy-primary text-base">
                  Vouches Audit — {moderatingWorker.name}
                </h3>
                <p className="text-xs text-content-secondary">
                  Remove fraudulent or spam vouches to recalculate trust score
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModeratingWorker(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {moderatingWorker.vouches.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No vouches on record for this worker.
                </div>
              ) : (
                moderatingWorker.vouches.map((vouch) => (
                  <div
                    key={vouch.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-navy-primary">{vouch.vouchedByName}</p>
                        <p className="text-[10px] text-slate-400">{vouch.role} • {vouch.vouchedByPhone}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: vouch.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-orange text-orange" />
                        ))}
                      </div>
                    </div>

                    {vouch.comment && (
                      <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                        &quot;{vouch.comment}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{vouch.createdAt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVouch(moderatingWorker.id, vouch.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Vouch</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                type="button"
                onClick={() => setModeratingWorker(null)}
                variant="primary"
                size="sm"
              >
                Close Moderation
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

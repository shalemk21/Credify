import { WorkerProfile, JobRequest, EmployerProfile, WageEstimate, Trade, BadgeLevel, BengaluruLocality } from '@/types';
import {
  INITIAL_WORKERS,
  INITIAL_EMPLOYERS,
  INITIAL_JOB_REQUESTS,
  WAGE_ESTIMATES,
  GOV_SCHEMES,
  TRANSFERABLE_SKILLS_MAP,
} from './mock-data';

export {
  INITIAL_WORKERS,
  INITIAL_EMPLOYERS,
  INITIAL_JOB_REQUESTS,
  WAGE_ESTIMATES,
  GOV_SCHEMES,
  TRANSFERABLE_SKILLS_MAP,
};

class Database {
  private workers: WorkerProfile[] = [...INITIAL_WORKERS];
  private employers: EmployerProfile[] = [...INITIAL_EMPLOYERS];
  private jobs: JobRequest[] = [...INITIAL_JOB_REQUESTS];

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedWorkers = localStorage.getItem('credify_workers');
        if (storedWorkers) {
          const parsed = JSON.parse(storedWorkers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.workers = parsed;
          }
        }

        const storedEmployers = localStorage.getItem('credify_employers');
        if (storedEmployers) {
          const parsed = JSON.parse(storedEmployers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.employers = parsed;
          }
        }

        const storedJobs = localStorage.getItem('credify_jobs');
        if (storedJobs) {
          const parsed = JSON.parse(storedJobs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.jobs = parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read from local storage', e);
      }
    }
  }

  private persistAll(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('credify_workers', JSON.stringify(this.workers));
        localStorage.setItem('credify_employers', JSON.stringify(this.employers));
        localStorage.setItem('credify_jobs', JSON.stringify(this.jobs));
      } catch (e) {
        console.warn('Could not persist to local storage', e);
      }
    }
  }

  // --- Workers ---
  getWorkers(): WorkerProfile[] {
    this.initFromStorage();
    return [...this.workers];
  }

  getWorkerById(id: string): WorkerProfile | undefined {
    this.initFromStorage();
    return this.workers.find(w => w.id === id);
  }

  updateWorker(id: string, updates: Partial<WorkerProfile>): WorkerProfile | undefined {
    this.initFromStorage();
    const idx = this.workers.findIndex(w => w.id === id);
    if (idx === -1) return undefined;
    this.workers[idx] = { ...this.workers[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persistAll();
    return this.workers[idx];
  }

  deleteWorker(id: string): boolean {
    this.initFromStorage();
    const idx = this.workers.findIndex(w => w.id === id);
    if (idx === -1) return false;
    this.workers.splice(idx, 1);
    this.persistAll();
    return true;
  }

  removeVouch(workerId: string, vouchId: string): boolean {
    this.initFromStorage();
    const worker = this.getWorkerById(workerId);
    if (!worker) return false;
    const updatedVouches = worker.vouches.filter(v => v.id !== vouchId);
    this.updateWorker(workerId, { vouches: updatedVouches });
    return true;
  }

  setWorkerStatus(workerId: string, status: 'active' | 'flagged' | 'suspended'): WorkerProfile | undefined {
    return this.updateWorker(workerId, { status });
  }

  addWorker(worker: WorkerProfile): WorkerProfile {
    this.initFromStorage();
    this.workers.unshift(worker);
    this.persistAll();
    return worker;
  }

  // --- Employers & Approval Workflow ---
  getEmployers(): EmployerProfile[] {
    this.initFromStorage();
    return [...this.employers];
  }

  getEmployerById(id: string): EmployerProfile | undefined {
    this.initFromStorage();
    return this.employers.find(e => e.id === id);
  }

  addEmployer(employer: EmployerProfile): EmployerProfile {
    this.initFromStorage();
    const exists = this.employers.findIndex(e => e.id === employer.id);
    if (exists !== -1) {
      this.employers[exists] = { ...this.employers[exists], ...employer };
    } else {
      this.employers.unshift(employer);
    }
    this.persistAll();

    // Call server SQLite API in background if in browser
    if (typeof window !== 'undefined') {
      fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employer),
      }).catch(() => {});
    }

    return employer;
  }

  updateEmployer(id: string, updates: Partial<EmployerProfile>): EmployerProfile | undefined {
    this.initFromStorage();
    const idx = this.employers.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    this.employers[idx] = { ...this.employers[idx], ...updates };
    this.persistAll();
    return this.employers[idx];
  }

  approveEmployer(id: string, adminName: string): EmployerProfile | undefined {
    this.initFromStorage();
    const idx = this.employers.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.employers[idx] = {
      ...this.employers[idx],
      status: 'APPROVED',
      verified: true,
      approvedAt: now,
      approvedBy: adminName,
      rejectionReason: undefined,
    };
    this.persistAll();

    if (typeof window !== 'undefined') {
      fetch(`/api/employers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', adminName }),
      }).catch(() => {});
    }

    return this.employers[idx];
  }

  rejectEmployer(id: string, adminName: string, reason?: string): EmployerProfile | undefined {
    this.initFromStorage();
    const idx = this.employers.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.employers[idx] = {
      ...this.employers[idx],
      status: 'REJECTED',
      verified: false,
      approvedAt: now,
      approvedBy: adminName,
      rejectionReason: reason || 'Application did not meet Credify Directorate verification requirements',
    };
    this.persistAll();

    if (typeof window !== 'undefined') {
      fetch(`/api/employers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', adminName, reason }),
      }).catch(() => {});
    }

    return this.employers[idx];
  }

  // --- Jobs / Hire Requests & Approval Workflow ---
  getJobs(): JobRequest[] {
    this.initFromStorage();
    return [...this.jobs];
  }

  getJobById(id: string): JobRequest | undefined {
    this.initFromStorage();
    return this.jobs.find(j => j.id === id);
  }

  addJob(job: JobRequest): JobRequest {
    this.initFromStorage();
    const fullJob: JobRequest = {
      ...job,
      approvalStatus: job.approvalStatus || 'PENDING_ADMIN_APPROVAL',
    };
    this.jobs.unshift(fullJob);
    this.persistAll();

    if (typeof window !== 'undefined') {
      fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullJob),
      }).catch(() => {});
    }

    return fullJob;
  }

  updateJob(id: string, updates: Partial<JobRequest>): JobRequest | undefined {
    this.initFromStorage();
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    this.persistAll();
    return this.jobs[idx];
  }

  approveJob(id: string, adminName: string): JobRequest | undefined {
    this.initFromStorage();
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.jobs[idx] = {
      ...this.jobs[idx],
      approvalStatus: 'APPROVED',
      approvedAt: now,
      approvedBy: adminName,
      rejectionReason: undefined,
    };
    this.persistAll();

    if (typeof window !== 'undefined') {
      fetch(`/api/jobs/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', adminName }),
      }).catch(() => {});
    }

    return this.jobs[idx];
  }

  rejectJob(id: string, adminName: string, reason?: string): JobRequest | undefined {
    this.initFromStorage();
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.jobs[idx] = {
      ...this.jobs[idx],
      approvalStatus: 'REJECTED',
      approvedAt: now,
      approvedBy: adminName,
      rejectionReason: reason || 'Wage offer below benchmark or site address incomplete',
    };
    this.persistAll();

    if (typeof window !== 'undefined') {
      fetch(`/api/jobs/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', adminName, reason }),
      }).catch(() => {});
    }

    return this.jobs[idx];
  }

  resetToDemo(): void {
    this.workers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    this.employers = JSON.parse(JSON.stringify(INITIAL_EMPLOYERS));
    this.jobs = JSON.parse(JSON.stringify(INITIAL_JOB_REQUESTS));
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('credify_workers');
        localStorage.removeItem('credify_employers');
        localStorage.removeItem('credify_jobs');
      } catch {}
    }
  }
}

const globalForDb = global as unknown as { credifyDb?: Database };
export const db = globalForDb.credifyDb || new Database();
if (process.env.NODE_ENV !== 'production') globalForDb.credifyDb = db;

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

  getWorkers(): WorkerProfile[] {
    return [...this.workers];
  }

  getWorkerById(id: string): WorkerProfile | undefined {
    return this.workers.find(w => w.id === id);
  }

  updateWorker(id: string, updates: Partial<WorkerProfile>): WorkerProfile | undefined {
    const idx = this.workers.findIndex(w => w.id === id);
    if (idx === -1) return undefined;
    this.workers[idx] = { ...this.workers[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.workers[idx];
  }

  addWorker(worker: WorkerProfile): WorkerProfile {
    this.workers.unshift(worker);
    return worker;
  }

  getEmployers(): EmployerProfile[] {
    return [...this.employers];
  }

  getEmployerById(id: string): EmployerProfile | undefined {
    return this.employers.find(e => e.id === id);
  }

  updateEmployer(id: string, updates: Partial<EmployerProfile>): EmployerProfile | undefined {
    const idx = this.employers.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    this.employers[idx] = { ...this.employers[idx], ...updates };
    return this.employers[idx];
  }

  getJobs(): JobRequest[] {
    return [...this.jobs];
  }

  addJob(job: JobRequest): JobRequest {
    this.jobs.unshift(job);
    return job;
  }

  updateJob(id: string, updates: Partial<JobRequest>): JobRequest | undefined {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    return this.jobs[idx];
  }

  resetToDemo(): void {
    this.workers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    this.employers = JSON.parse(JSON.stringify(INITIAL_EMPLOYERS));
    this.jobs = JSON.parse(JSON.stringify(INITIAL_JOB_REQUESTS));
  }
}

const globalForDb = global as unknown as { credifyDb?: Database };
export const db = globalForDb.credifyDb || new Database();
if (process.env.NODE_ENV !== 'production') globalForDb.credifyDb = db;

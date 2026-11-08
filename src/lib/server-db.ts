import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { WorkerProfile, JobRequest, EmployerProfile, Vouch } from '../types';
import { INITIAL_WORKERS, INITIAL_EMPLOYERS, INITIAL_JOB_REQUESTS } from './mock-data';

class SQLiteServerDatabase {
  private db: DatabaseSync;
  private initialized = false;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }

    const dbPath = path.join(dataDir, 'credify.db');
    this.db = new DatabaseSync(dbPath);

    try {
      this.db.exec('PRAGMA journal_mode = WAL;');
      this.db.exec('PRAGMA busy_timeout = 5000;');
    } catch {}

    this.initTables();
    this.seedIfEmpty();
  }

  private initTables(): void {
    try {
      // 1. Employers Table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS employers (
          id TEXT PRIMARY KEY,
          company_name TEXT NOT NULL,
          contact_person TEXT,
          type TEXT,
          locality TEXT,
          phone TEXT,
          email TEXT,
          gstin TEXT,
          verified INTEGER DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
          application_date TEXT NOT NULL,
          approved_at TEXT,
          approved_by TEXT,
          rejection_reason TEXT,
          shortlisted_worker_ids TEXT
        );
      `);

      // 2. Job / Hire Requests Table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS job_requests (
          id TEXT PRIMARY KEY,
          employer_id TEXT NOT NULL,
          employer_name TEXT NOT NULL,
          trade TEXT NOT NULL,
          locality TEXT NOT NULL,
          required_workers INTEGER NOT NULL DEFAULT 1,
          duration TEXT NOT NULL,
          daily_wage_offer INTEGER NOT NULL,
          description TEXT,
          created_at TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'open',
          approval_status TEXT NOT NULL DEFAULT 'PENDING_ADMIN_APPROVAL',
          approved_at TEXT,
          approved_by TEXT,
          rejection_reason TEXT,
          target_worker_id TEXT,
          target_worker_name TEXT,
          responses_json TEXT
        );
      `);

      // 3. Workers Table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS workers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT,
          trade TEXT NOT NULL,
          locality TEXT NOT NULL,
          years_of_experience INTEGER NOT NULL DEFAULT 1,
          trust_score INTEGER NOT NULL DEFAULT 10,
          badge_level TEXT NOT NULL DEFAULT 'Bronze',
          status TEXT NOT NULL DEFAULT 'active',
          assessor_verified INTEGER NOT NULL DEFAULT 0,
          safety_aware INTEGER NOT NULL DEFAULT 0,
          profile_json TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
    } catch (err) {
      // Table might already exist or be initialized by concurrent worker
    }
  }

  private seedIfEmpty(): void {
    try {
      // Seed Employers
      const empCount = (this.db.prepare('SELECT COUNT(*) as count FROM employers').get() as { count: number })?.count ?? 0;
      if (empCount === 0) {
        const insertEmp = this.db.prepare(`
          INSERT OR IGNORE INTO employers (
            id, company_name, contact_person, type, locality, phone, email, gstin,
            verified, status, application_date, approved_at, approved_by, rejection_reason,
            shortlisted_worker_ids
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const emp of INITIAL_EMPLOYERS) {
          insertEmp.run(
            emp.id,
            emp.companyName,
            emp.contactPerson || '',
            emp.type || 'contractor',
            emp.locality,
            emp.phone || '',
            emp.email || '',
            emp.gstin || '',
            emp.verified ? 1 : 0,
            emp.status || 'PENDING_APPROVAL',
            emp.applicationDate || new Date().toISOString().slice(0, 10),
            emp.approvedAt || null,
            emp.approvedBy || null,
            emp.rejectionReason || null,
            JSON.stringify(emp.shortlistedWorkerIds || [])
          );
        }
      }

      // Seed Jobs
      const jobCount = (this.db.prepare('SELECT COUNT(*) as count FROM job_requests').get() as { count: number })?.count ?? 0;
      if (jobCount === 0) {
        const insertJob = this.db.prepare(`
          INSERT OR IGNORE INTO job_requests (
            id, employer_id, employer_name, trade, locality, required_workers,
            duration, daily_wage_offer, description, created_at, status,
            approval_status, approved_at, approved_by, rejection_reason,
            target_worker_id, target_worker_name, responses_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const job of INITIAL_JOB_REQUESTS) {
          insertJob.run(
            job.id,
            job.employerId,
            job.employerName,
            job.trade,
            job.locality,
            job.requiredWorkers,
            job.duration,
            job.dailyWageOffer,
            job.description,
            job.createdAt,
            job.status,
            job.approvalStatus || 'PENDING_ADMIN_APPROVAL',
            job.approvedAt || null,
            job.approvedBy || null,
            job.rejectionReason || null,
            job.targetWorkerId || null,
            job.targetWorkerName || null,
            JSON.stringify(job.responses || [])
          );
        }
      }

      // Seed Workers
      const workerCount = (this.db.prepare('SELECT COUNT(*) as count FROM workers').get() as { count: number })?.count ?? 0;
      if (workerCount === 0) {
        const insertWorker = this.db.prepare(`
          INSERT OR IGNORE INTO workers (
            id, name, phone, trade, locality, years_of_experience, trust_score,
            badge_level, status, assessor_verified, safety_aware, profile_json,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const w of INITIAL_WORKERS) {
          insertWorker.run(
            w.id,
            w.name,
            w.phone,
            w.trade,
            w.locality,
            w.yearsOfExperience,
            w.trustScore,
            w.badgeLevel,
            w.status || 'active',
            w.assessorVerified ? 1 : 0,
            w.safetyAware ? 1 : 0,
            JSON.stringify(w),
            w.createdAt || new Date().toISOString(),
            w.updatedAt || new Date().toISOString()
          );
        }
      }
    } catch (err) {
      // Handled if concurrent worker seeds
    }
  }

  // --- Employers ---
  getEmployers(): EmployerProfile[] {
    const rows = this.db.prepare('SELECT * FROM employers ORDER BY application_date DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      companyName: r.company_name,
      contactPerson: r.contact_person,
      type: r.type,
      locality: r.locality,
      phone: r.phone,
      email: r.email,
      gstin: r.gstin,
      verified: Boolean(r.verified),
      status: r.status,
      applicationDate: r.application_date,
      approvedAt: r.approved_at || undefined,
      approvedBy: r.approved_by || undefined,
      rejectionReason: r.rejection_reason || undefined,
      shortlistedWorkerIds: r.shortlisted_worker_ids ? JSON.parse(r.shortlisted_worker_ids) : [],
    }));
  }

  getEmployerById(id: string): EmployerProfile | undefined {
    const r = this.db.prepare('SELECT * FROM employers WHERE id = ?').get(id) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      companyName: r.company_name,
      contactPerson: r.contact_person,
      type: r.type,
      locality: r.locality,
      phone: r.phone,
      email: r.email,
      gstin: r.gstin,
      verified: Boolean(r.verified),
      status: r.status,
      applicationDate: r.application_date,
      approvedAt: r.approved_at || undefined,
      approvedBy: r.approved_by || undefined,
      rejectionReason: r.rejection_reason || undefined,
      shortlistedWorkerIds: r.shortlisted_worker_ids ? JSON.parse(r.shortlisted_worker_ids) : [],
    };
  }

  addEmployer(emp: EmployerProfile): EmployerProfile {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO employers (
        id, company_name, contact_person, type, locality, phone, email, gstin,
        verified, status, application_date, approved_at, approved_by, rejection_reason,
        shortlisted_worker_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      emp.id,
      emp.companyName,
      emp.contactPerson || '',
      emp.type || 'contractor',
      emp.locality,
      emp.phone || '',
      emp.email || '',
      emp.gstin || '',
      emp.verified ? 1 : 0,
      emp.status || 'PENDING_APPROVAL',
      emp.applicationDate || new Date().toISOString().slice(0, 10),
      emp.approvedAt || null,
      emp.approvedBy || null,
      emp.rejectionReason || null,
      JSON.stringify(emp.shortlistedWorkerIds || [])
    );

    return emp;
  }

  approveEmployer(id: string, adminName: string): EmployerProfile | undefined {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const stmt = this.db.prepare(`
      UPDATE employers
      SET status = 'APPROVED', verified = 1, approved_at = ?, approved_by = ?, rejection_reason = NULL
      WHERE id = ?
    `);
    stmt.run(now, adminName, id);
    return this.getEmployerById(id);
  }

  rejectEmployer(id: string, adminName: string, reason?: string): EmployerProfile | undefined {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const stmt = this.db.prepare(`
      UPDATE employers
      SET status = 'REJECTED', verified = 0, approved_at = ?, approved_by = ?, rejection_reason = ?
      WHERE id = ?
    `);
    stmt.run(now, adminName, reason || 'Did not meet compliance criteria', id);
    return this.getEmployerById(id);
  }

  // --- Jobs / Hire Requests ---
  getJobs(): JobRequest[] {
    const rows = this.db.prepare('SELECT * FROM job_requests ORDER BY created_at DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      employerId: r.employer_id,
      employerName: r.employer_name,
      trade: r.trade,
      locality: r.locality,
      requiredWorkers: r.required_workers,
      duration: r.duration,
      dailyWageOffer: r.daily_wage_offer,
      description: r.description,
      createdAt: r.created_at,
      status: r.status,
      approvalStatus: r.approval_status,
      approvedAt: r.approved_at || undefined,
      approvedBy: r.approved_by || undefined,
      rejectionReason: r.rejection_reason || undefined,
      targetWorkerId: r.target_worker_id || undefined,
      targetWorkerName: r.target_worker_name || undefined,
      responses: r.responses_json ? JSON.parse(r.responses_json) : [],
    }));
  }

  getJobById(id: string): JobRequest | undefined {
    const r = this.db.prepare('SELECT * FROM job_requests WHERE id = ?').get(id) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      employerId: r.employer_id,
      employerName: r.employer_name,
      trade: r.trade,
      locality: r.locality,
      requiredWorkers: r.required_workers,
      duration: r.duration,
      dailyWageOffer: r.daily_wage_offer,
      description: r.description,
      createdAt: r.created_at,
      status: r.status,
      approvalStatus: r.approval_status,
      approvedAt: r.approved_at || undefined,
      approvedBy: r.approved_by || undefined,
      rejectionReason: r.rejection_reason || undefined,
      targetWorkerId: r.target_worker_id || undefined,
      targetWorkerName: r.target_worker_name || undefined,
      responses: r.responses_json ? JSON.parse(r.responses_json) : [],
    };
  }

  addJob(job: JobRequest): JobRequest {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO job_requests (
        id, employer_id, employer_name, trade, locality, required_workers,
        duration, daily_wage_offer, description, created_at, status,
        approval_status, approved_at, approved_by, rejection_reason,
        target_worker_id, target_worker_name, responses_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      job.id,
      job.employerId,
      job.employerName,
      job.trade,
      job.locality,
      job.requiredWorkers,
      job.duration,
      job.dailyWageOffer,
      job.description,
      job.createdAt,
      job.status,
      job.approvalStatus || 'PENDING_ADMIN_APPROVAL',
      job.approvedAt || null,
      job.approvedBy || null,
      job.rejectionReason || null,
      job.targetWorkerId || null,
      job.targetWorkerName || null,
      JSON.stringify(job.responses || [])
    );

    return job;
  }

  approveJob(id: string, adminName: string): JobRequest | undefined {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const stmt = this.db.prepare(`
      UPDATE job_requests
      SET approval_status = 'APPROVED', approved_at = ?, approved_by = ?, rejection_reason = NULL
      WHERE id = ?
    `);
    stmt.run(now, adminName, id);
    return this.getJobById(id);
  }

  rejectJob(id: string, adminName: string, reason?: string): JobRequest | undefined {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const stmt = this.db.prepare(`
      UPDATE job_requests
      SET approval_status = 'REJECTED', approved_at = ?, approved_by = ?, rejection_reason = ?
      WHERE id = ?
    `);
    stmt.run(now, adminName, reason || 'Rate below standard or site verification failed', id);
    return this.getJobById(id);
  }

  // --- Workers ---
  getWorkers(): WorkerProfile[] {
    const rows = this.db.prepare('SELECT * FROM workers').all() as any[];
    return rows.map(r => JSON.parse(r.profile_json) as WorkerProfile);
  }

  getWorkerById(id: string): WorkerProfile | undefined {
    const r = this.db.prepare('SELECT * FROM workers WHERE id = ?').get(id) as any;
    if (!r) return undefined;
    return JSON.parse(r.profile_json) as WorkerProfile;
  }

  updateWorker(id: string, updates: Partial<WorkerProfile>): WorkerProfile | undefined {
    const existing = this.getWorkerById(id);
    if (!existing) return undefined;

    const updated: WorkerProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const stmt = this.db.prepare(`
      UPDATE workers
      SET name = ?, trade = ?, locality = ?, years_of_experience = ?,
          trust_score = ?, badge_level = ?, status = ?, assessor_verified = ?,
          safety_aware = ?, profile_json = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.name,
      updated.trade,
      updated.locality,
      updated.yearsOfExperience,
      updated.trustScore,
      updated.badgeLevel,
      updated.status || 'active',
      updated.assessorVerified ? 1 : 0,
      updated.safetyAware ? 1 : 0,
      JSON.stringify(updated),
      updated.updatedAt,
      id
    );

    return updated;
  }

  deleteWorker(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM workers WHERE id = ?');
    stmt.run(id);
    return true;
  }

  addWorker(worker: WorkerProfile): WorkerProfile {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO workers (
        id, name, phone, trade, locality, years_of_experience, trust_score,
        badge_level, status, assessor_verified, safety_aware, profile_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      worker.id,
      worker.name,
      worker.phone,
      worker.trade,
      worker.locality,
      worker.yearsOfExperience,
      worker.trustScore,
      worker.badgeLevel,
      worker.status || 'active',
      worker.assessorVerified ? 1 : 0,
      worker.safetyAware ? 1 : 0,
      JSON.stringify(worker),
      worker.createdAt || new Date().toISOString(),
      worker.updatedAt || new Date().toISOString()
    );

    return worker;
  }

  resetDatabase(): void {
    this.db.exec('DROP TABLE IF EXISTS employers');
    this.db.exec('DROP TABLE IF EXISTS job_requests');
    this.db.exec('DROP TABLE IF EXISTS workers');
    this.initTables();
    this.seedIfEmpty();
  }
}

// In Next.js SSR / worker threads, reuse singleton across module loads
const globalForServerDb = global as unknown as { credifySQLite?: SQLiteServerDatabase };
export const serverDb = globalForServerDb.credifySQLite || new SQLiteServerDatabase();
if (process.env.NODE_ENV !== 'production') globalForServerDb.credifySQLite = serverDb;

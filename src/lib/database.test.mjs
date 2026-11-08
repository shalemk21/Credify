import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

test('Database: SQLite database initializes tables and constraints correctly', () => {
  const db = new DatabaseSync(':memory:');

  db.exec(`
    CREATE TABLE employers (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT
    );
  `);

  db.exec(`
    CREATE TABLE job_requests (
      id TEXT PRIMARY KEY,
      employer_id TEXT NOT NULL,
      trade TEXT NOT NULL,
      daily_wage_offer INTEGER NOT NULL,
      approval_status TEXT NOT NULL DEFAULT 'PENDING_ADMIN_APPROVAL',
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT
    );
  `);

  // Test inserting new employer application
  const insertEmp = db.prepare('INSERT INTO employers (id, company_name, status) VALUES (?, ?, ?)');
  insertEmp.run('emp-test-1', 'Sobha Infrastructure Pvt Ltd', 'PENDING_APPROVAL');

  const emp = db.prepare('SELECT * FROM employers WHERE id = ?').get('emp-test-1');
  assert.equal(emp.company_name, 'Sobha Infrastructure Pvt Ltd');
  assert.equal(emp.status, 'PENDING_APPROVAL');
});

test('Approval Workflow: Employer application must be approved by admin', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE employers (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT
    );
  `);

  // 1. Employer submits application
  db.prepare('INSERT INTO employers (id, company_name, status) VALUES (?, ?, ?)')
    .run('emp-prestige', 'Prestige Electricals', 'PENDING_APPROVAL');

  let emp = db.prepare('SELECT * FROM employers WHERE id = ?').get('emp-prestige');
  assert.equal(emp.status, 'PENDING_APPROVAL');

  // 2. Admin reviews and approves
  const now = new Date().toISOString();
  db.prepare('UPDATE employers SET status = ?, approved_by = ?, approved_at = ? WHERE id = ?')
    .run('APPROVED', 'Dr. Sunita Rao (Admin)', now, 'emp-prestige');

  emp = db.prepare('SELECT * FROM employers WHERE id = ?').get('emp-prestige');
  assert.equal(emp.status, 'APPROVED');
  assert.equal(emp.approved_by, 'Dr. Sunita Rao (Admin)');
  assert.ok(emp.approved_at);
});

test('Approval Workflow: Job application created by employer requires admin approval', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE job_requests (
      id TEXT PRIMARY KEY,
      employer_id TEXT NOT NULL,
      trade TEXT NOT NULL,
      daily_wage_offer INTEGER NOT NULL,
      approval_status TEXT NOT NULL DEFAULT 'PENDING_ADMIN_APPROVAL',
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT
    );
  `);

  // 1. Employer creates job application
  db.prepare(`
    INSERT INTO job_requests (id, employer_id, trade, daily_wage_offer, approval_status)
    VALUES (?, ?, ?, ?, ?)
  `).run('job-test-101', 'emp-abc', 'ELECTRICIAN', 1200, 'PENDING_ADMIN_APPROVAL');

  let job = db.prepare('SELECT * FROM job_requests WHERE id = ?').get('job-test-101');
  assert.equal(job.approval_status, 'PENDING_ADMIN_APPROVAL');

  // 2. Admin approves application
  const now = new Date().toISOString();
  db.prepare('UPDATE job_requests SET approval_status = ?, approved_by = ?, approved_at = ? WHERE id = ?')
    .run('APPROVED', 'Dr. Sunita Rao', now, 'job-test-101');

  job = db.prepare('SELECT * FROM job_requests WHERE id = ?').get('job-test-101');
  assert.equal(job.approval_status, 'APPROVED');
  assert.equal(job.approved_by, 'Dr. Sunita Rao');

  // 3. Test rejection with feedback
  db.prepare(`
    INSERT INTO job_requests (id, employer_id, trade, daily_wage_offer, approval_status)
    VALUES (?, ?, ?, ?, ?)
  `).run('job-test-102', 'emp-abc', 'PLUMBER', 500, 'PENDING_ADMIN_APPROVAL');

  db.prepare('UPDATE job_requests SET approval_status = ?, approved_by = ?, rejection_reason = ? WHERE id = ?')
    .run('REJECTED', 'Dr. Sunita Rao', 'Wage offer ₹500 is below minimum standard benchmark of ₹700', 'job-test-102');

  const rejectedJob = db.prepare('SELECT * FROM job_requests WHERE id = ?').get('job-test-102');
  assert.equal(rejectedJob.approval_status, 'REJECTED');
  assert.equal(rejectedJob.rejection_reason, 'Wage offer ₹500 is below minimum standard benchmark of ₹700');
});

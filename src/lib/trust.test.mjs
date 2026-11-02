import test from 'node:test';
import assert from 'node:assert/strict';

// Direct logic test of trust calculation to ensure zero dependency testing
function getBadgeLevel(totalScore) {
  if (totalScore >= 70) return 'Gold';
  if (totalScore >= 40) return 'Silver';
  return 'Bronze';
}

function calculateTrustScore(params) {
  const {
    declaredSkills = [],
    evidence = [],
    vouches = [],
    assessment = null,
    assessorVerified = false,
  } = params;

  const declaredSkillsScore = declaredSkills.length > 0 ? 10 : 0;
  const validEvidence = evidence.filter(e => e.mediaUrl && e.timestamp);
  const workEvidenceScore = Math.min(20, validEvidence.length * 7);

  let rawVouchScore = 0;
  const verifiedVouches = vouches.filter(v => v.verifiedOtp && v.workedTogether);
  for (const vouch of verifiedVouches) {
    const starRatio = Math.max(0, Math.min(5, vouch.rating)) / 5;
    rawVouchScore += starRatio * 10;
  }
  const vouchesScore = Math.min(30, Math.round(rawVouchScore));

  let assessmentScore = 0;
  if (assessment && typeof assessment.score === 'number') {
    assessmentScore = Math.min(30, Math.max(0, Math.round(assessment.score)));
  }

  const assessorVerifiedScore = assessorVerified ? 10 : 0;

  const totalScore = Math.min(
    100,
    declaredSkillsScore +
    workEvidenceScore +
    vouchesScore +
    assessmentScore +
    assessorVerifiedScore
  );

  return {
    declaredSkillsScore,
    workEvidenceScore,
    vouchesScore,
    assessmentScore,
    assessorVerifiedScore,
    totalScore,
    badgeLevel: getBadgeLevel(totalScore),
  };
}

test('Trust Score: should award baseline 10 points for self-declared skills', () => {
  const res = calculateTrustScore({ declaredSkills: ['Wiring', 'Fans'] });
  assert.equal(res.declaredSkillsScore, 10);
  assert.equal(res.totalScore, 10);
  assert.equal(res.badgeLevel, 'Bronze');
});

test('Trust Score: should award points for work evidence up to max 20', () => {
  const evidence = [
    { mediaUrl: '/img1.jpg', timestamp: '2026-01-01' },
    { mediaUrl: '/img2.jpg', timestamp: '2026-01-02' },
    { mediaUrl: '/img3.jpg', timestamp: '2026-01-03' },
    { mediaUrl: '/img4.jpg', timestamp: '2026-01-04' },
  ];
  const res = calculateTrustScore({ evidence });
  assert.equal(res.workEvidenceScore, 20); // capped at 20
});

test('Trust Score: should weigh verified vouches by star rating up to max 30', () => {
  const vouches = [
    { verifiedOtp: true, workedTogether: true, rating: 5 },
    { verifiedOtp: true, workedTogether: true, rating: 5 },
    { verifiedOtp: true, workedTogether: true, rating: 5 },
  ];
  const res = calculateTrustScore({ vouches });
  assert.equal(res.vouchesScore, 30);
});

test('Trust Score: Ramesh K. profile calculation matches Gold tier (> 70)', () => {
  const ramesh = {
    declaredSkills: ['House Wiring', 'Fans', 'Inverters'],
    evidence: [
      { mediaUrl: '/demo/db-box.jpg', timestamp: '2026-02-01' },
      { mediaUrl: '/demo/wiring.jpg', timestamp: '2026-02-15' },
      { mediaUrl: '/demo/inverter.jpg', timestamp: '2026-03-01' },
    ],
    vouches: [
      { verifiedOtp: true, workedTogether: true, rating: 5 },
      { verifiedOtp: true, workedTogether: true, rating: 5 },
      { verifiedOtp: true, workedTogether: true, rating: 5 },
    ],
    assessment: { score: 26, maxScore: 30 },
    assessorVerified: true,
  };

  const res = calculateTrustScore(ramesh);
  assert.ok(res.totalScore >= 90, `Expected >= 90, got ${res.totalScore}`);
  assert.equal(res.badgeLevel, 'Gold');
});

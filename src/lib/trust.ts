import { BadgeLevel, Vouch, WorkEvidence, AssessmentResult } from '@/types';

export interface TrustScoreBreakdown {
  declaredSkillsScore: number; // max 10
  workEvidenceScore: number;   // max 20
  vouchesScore: number;        // max 30
  assessmentScore: number;     // max 30
  assessorVerifiedScore: number; // max 10
  totalScore: number;          // 0-100
  badgeLevel: BadgeLevel;
}

export function getBadgeLevel(totalScore: number): BadgeLevel {
  if (totalScore >= 70) return 'Gold';
  if (totalScore >= 40) return 'Silver';
  return 'Bronze';
}

/**
 * Calculates the explainable trust score (0 - 100) based on verified signals
 */
export function calculateTrustScore(params: {
  declaredSkills?: string[];
  evidence?: WorkEvidence[];
  vouches?: Vouch[];
  assessment?: AssessmentResult | null;
  assessorVerified?: boolean;
}): TrustScoreBreakdown {
  const {
    declaredSkills = [],
    evidence = [],
    vouches = [],
    assessment = null,
    assessorVerified = false,
  } = params;

  // 1. Self-declared skills: 10 points (if at least 1 declared skill)
  const declaredSkillsScore = declaredSkills.length > 0 ? 10 : 0;

  // 2. Work evidence: up to 20 points (6 points per valid item, max 20)
  const validEvidence = evidence.filter(e => e.mediaUrl && e.timestamp);
  const workEvidenceScore = Math.min(20, validEvidence.length * 7);

  // 3. Vouches: up to 30 points (phone-verified, weighted by rating & positive confirmation)
  // Each valid vouch contributes up to 10 points based on (rating / 5) * 10
  let rawVouchScore = 0;
  const verifiedVouches = vouches.filter(v => v.verifiedOtp && v.workedTogether);
  for (const vouch of verifiedVouches) {
    const starRatio = Math.max(0, Math.min(5, vouch.rating)) / 5;
    rawVouchScore += starRatio * 10;
  }
  const vouchesScore = Math.min(30, Math.round(rawVouchScore));

  // 4. Practical assessment: up to 30 points
  let assessmentScore = 0;
  if (assessment && typeof assessment.score === 'number') {
    assessmentScore = Math.min(30, Math.max(0, Math.round(assessment.score)));
  }

  // 5. Assessor/training partner verified: up to 10 points
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

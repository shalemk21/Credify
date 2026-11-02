import { BengaluruLocality, MatchFactorBreakdown, WorkerProfile, Trade } from '@/types';

export const LOCALITY_COORDINATES: Record<BengaluruLocality, { lat: number; lng: number }> = {
  'Whitefield': { lat: 12.9698, lng: 77.7500 },
  'Koramangala': { lat: 12.9352, lng: 77.6245 },
  'HSR Layout': { lat: 12.9121, lng: 77.6446 },
  'Jayanagar': { lat: 12.9308, lng: 77.5838 },
  'Indiranagar': { lat: 12.9784, lng: 77.6408 },
  'Electronic City': { lat: 12.8452, lng: 77.6602 },
};

export function calculateDistanceKm(fromLocality: BengaluruLocality, toLocality: BengaluruLocality): number {
  if (fromLocality === toLocality) return 1.2; // nearby within same locality
  const from = LOCALITY_COORDINATES[fromLocality] || LOCALITY_COORDINATES['Whitefield'];
  const to = LOCALITY_COORDINATES[toLocality] || LOCALITY_COORDINATES['Whitefield'];

  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export interface MatchCriteria {
  trade?: Trade;
  requiredSkills?: string[];
  employerLocality: BengaluruLocality;
  preferredLanguage?: 'English' | 'हिन्दी' | 'ಕನ್ನಡ';
  minExperienceYears?: number;
  minTrustScore?: number;
}

/**
 * Calculates a fair, explainable match score (0-100%) between an employer requirement
 * and a worker profile.
 * 
 * CRITICAL SAFEGUARD: Matching is strictly merit & signal based.
 * It NEVER factors in name, gender, caste, religion, or worker photograph.
 */
export function calculateMatchScore(
  worker: WorkerProfile,
  criteria: MatchCriteria
): MatchFactorBreakdown {
  // Trade filter check: if trade is specified and does not match, return low score
  const tradeMatches = !criteria.trade || worker.trade === criteria.trade;
  if (!tradeMatches) {
    return {
      skillsMatch: 0,
      experienceMatch: 0,
      locationMatch: 0,
      trustScoreMatch: 0,
      availabilityScore: 0,
      languageBonus: 0,
      overallMatchScore: 10,
      distanceKm: calculateDistanceKm(criteria.employerLocality, worker.locality),
      oneLineExplanation: `Trade mismatch: Worker is an expert in ${worker.trade}`,
      verifiedSummary: `Profile verified with ${worker.vouches.length} vouches & ${worker.evidence.length} work items`,
    };
  }

  // 1. Skills Match (35% weight)
  // Evaluates verified skills (full weight) and declared skills (half weight)
  let skillsScore = 80;
  if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
    let matchedScore = 0;
    const reqCount = criteria.requiredSkills.length;
    for (const req of criteria.requiredSkills) {
      const isVerified = worker.verifiedSkills.some(s => s.toLowerCase().includes(req.toLowerCase()));
      const isDeclared = worker.declaredSkills.some(s => s.toLowerCase().includes(req.toLowerCase()));
      if (isVerified) {
        matchedScore += 1;
      } else if (isDeclared) {
        matchedScore += 0.6;
      }
    }
    skillsScore = Math.min(100, Math.round((matchedScore / reqCount) * 100));
  } else {
    // If no specific skill required, score based on verified skills depth & badge
    const skillCount = worker.verifiedSkills.length;
    skillsScore = worker.badgeLevel === 'Gold' ? 95 : worker.badgeLevel === 'Silver' ? 85 : 70;
    skillsScore = Math.min(98, skillsScore + Math.min(10, skillCount * 2));
  }

  // 2. Experience Match (20% weight)
  const targetExp = criteria.minExperienceYears || 4;
  let experienceScore = 75;
  if (worker.yearsOfExperience >= targetExp) {
    experienceScore = Math.min(100, 85 + (worker.yearsOfExperience - targetExp) * 3);
  } else {
    experienceScore = Math.max(40, Math.round((worker.yearsOfExperience / targetExp) * 80));
  }

  // 3. Location / Distance Match (20% weight)
  const distanceKm = calculateDistanceKm(criteria.employerLocality, worker.locality);
  let locationScore = 100;
  if (distanceKm <= 3) {
    locationScore = 95;
  } else if (distanceKm <= 7) {
    locationScore = 85;
  } else if (distanceKm <= 12) {
    locationScore = 72;
  } else if (distanceKm <= 20) {
    locationScore = 55;
  } else {
    locationScore = Math.max(30, Math.round(100 - distanceKm * 2.5));
  }

  // 4. Trust Score factor (15% weight)
  const trustScoreMatch = Math.min(100, Math.max(20, worker.trustScore));

  // 5. Availability (5% weight)
  let availabilityScore = 70;
  if (worker.availability === 'today') availabilityScore = 100;
  else if (worker.availability === 'this_week') availabilityScore = 85;
  else availabilityScore = 30;

  // 6. Language Bonus (5% weight)
  let languageBonus = 70;
  if (criteria.preferredLanguage && worker.languages.includes(criteria.preferredLanguage)) {
    languageBonus = 100;
  }

  // Weighted overall calculation
  const overallRaw =
    skillsScore * 0.35 +
    experienceScore * 0.20 +
    locationScore * 0.20 +
    trustScoreMatch * 0.15 +
    availabilityScore * 0.05 +
    languageBonus * 0.05;

  const overallMatchScore = Math.min(99, Math.max(40, Math.round(overallRaw)));

  // Generate explainable summary
  const topSkill = worker.verifiedSkills[0] || worker.declaredSkills[0] || worker.trade;
  const langSpoken = worker.languages.includes('ಕನ್ನಡ') ? 'speaks Kannada' : `speaks ${worker.languages[0]}`;
  const oneLineExplanation = `${overallMatchScore}% match: verified ${topSkill.toLowerCase()} (${worker.badgeLevel}), ${worker.yearsOfExperience} yrs, ${distanceKm} km away, ${worker.vouches.length} vouches, ${langSpoken}`;

  const verifiedSummary = `Verified Profile: with ${worker.vouches.length} vouches & ${worker.evidence.length} work evidence`;

  return {
    skillsMatch: skillsScore,
    experienceMatch: experienceScore,
    locationMatch: locationScore,
    trustScoreMatch,
    availabilityScore,
    languageBonus,
    overallMatchScore,
    distanceKm,
    oneLineExplanation,
    verifiedSummary,
  };
}

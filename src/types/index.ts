export type Trade = 'ELECTRICIAN' | 'PLUMBER';

export type BadgeLevel = 'Bronze' | 'Silver' | 'Gold';

export type BengaluruLocality = 'Whitefield' | 'Koramangala' | 'HSR Layout' | 'Jayanagar' | 'Indiranagar' | 'Electronic City';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WorkEvidence {
  id: string;
  workerId: string;
  title: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: 'photo' | 'video';
  timestamp: string;
  location?: string;
  verified: boolean;
  notes?: string;
}

export interface Vouch {
  id: string;
  workerId: string;
  vouchedByName: string;
  vouchedByPhone: string; // duplicate prevention
  role: 'Homeowner' | 'Contractor' | 'Site Supervisor' | 'Client';
  rating: number; // 1-5
  workedTogether: boolean;
  comment?: string;
  createdAt: string;
  verifiedOtp: boolean;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface AssessmentResult {
  score: number; // 0 - 30
  maxScore: number;
  levelEarned: BadgeLevel;
  completedAt: string;
  missingSkills: string[];
}

export interface SafetyCheckResult {
  passed: boolean;
  score: number;
  completedAt: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  trade: Trade;
  locality: BengaluruLocality;
  yearsOfExperience: number;
  languages: ('English' | 'हिन्दी' | 'ಕನ್ನಡ')[];
  availability: 'today' | 'this_week' | 'not_looking';
  
  // Skill declarations
  declaredSkills: string[];
  verifiedSkills: string[];
  
  // Trust components
  evidence: WorkEvidence[];
  vouches: Vouch[];
  assessment?: AssessmentResult;
  safetyAware: boolean;
  assessorVerified: boolean; // Admin toggle
  
  // Computed scores
  trustScore: number; // 0-100
  badgeLevel: BadgeLevel;
  
  // Consent & Privacy (DPDP Act)
  privacySettings: {
    showPhone: boolean;
    showLocation: boolean;
    showVideos: boolean;
    consentGiven: boolean;
    consentTimestamp: string;
  };
  
  profileViews: {
    viewedByCompany: string;
    viewedAt: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
}

export interface MatchFactorBreakdown {
  skillsMatch: number;      // 0-100
  experienceMatch: number;  // 0-100
  locationMatch: number;    // 0-100
  trustScoreMatch: number;  // 0-100
  availabilityScore: number;
  languageBonus: number;
  overallMatchScore: number;// 0-100
  distanceKm: number;
  oneLineExplanation: string;
  verifiedSummary: string;
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  type: 'contractor' | 'factory' | 'homeowner';
  locality: BengaluruLocality;
  shortlistedWorkerIds: string[];
}

export interface JobRequest {
  id: string;
  employerId: string;
  employerName: string;
  trade: Trade;
  locality: BengaluruLocality;
  requiredWorkers: number;
  duration: string;
  dailyWageOffer: number;
  description: string;
  createdAt: string;
  status: 'open' | 'fulfilled' | 'closed';
  responses: {
    workerId: string;
    status: 'accepted' | 'declined' | 'pending';
    respondedAt?: string;
  }[];
}

export interface WageEstimate {
  trade: Trade;
  level: BadgeLevel;
  locality: BengaluruLocality;
  minDailyWage: number;
  maxDailyWage: number;
  avgDailyWage: number;
}

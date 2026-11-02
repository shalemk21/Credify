import { WorkerProfile, JobRequest, EmployerProfile, WageEstimate, Trade, BadgeLevel, BengaluruLocality } from '@/types';

// Seed workers matching the visual showcase and section 12
export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-ramesh-k',
    name: 'Ramesh K.',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Whitefield',
    yearsOfExperience: 8,
    languages: ['ಕನ್ನಡ', 'हिन्दी', 'English'],
    availability: 'today',
    declaredSkills: ['House Wiring', 'Fans', 'Inverters', 'MCB Installation', 'Conduit Piping'],
    verifiedSkills: ['House Wiring', 'Fans', 'Inverters', 'MCB Installation', 'Conduit Piping'],
    trustScore: 92,
    badgeLevel: 'Gold',
    safetyAware: true,
    assessorVerified: true,
    evidence: [
      {
        id: 'ev-1',
        workerId: 'worker-ramesh-k',
        title: '3-Phase Distribution Board & MCB Dressing',
        mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-14 14:32:00',
        location: 'Whitefield Villa Project',
        verified: true,
        notes: 'Proper load balancing, earthing resistance < 2 ohms verified'
      },
      {
        id: 'ev-2',
        workerId: 'worker-ramesh-k',
        title: 'Pure Sinewave Inverter & Battery Bank Setup',
        mediaUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-28 11:15:00',
        location: 'ECC Road, Whitefield',
        verified: true
      },
      {
        id: 'ev-3',
        workerId: 'worker-ramesh-k',
        title: 'Ceiling Concealed Conduit Wiring & Fan Boxes',
        mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-03-10 16:45:00',
        location: 'Hope Farm, Whitefield',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-1',
        workerId: 'worker-ramesh-k',
        vouchedByName: 'Sanjay Hegde',
        vouchedByPhone: '+91 98450 11223',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Ramesh wired my entire 3BHK house. Extremely clean DB box dressing and reliable earthing work.',
        createdAt: '2026-03-01',
        verifiedOtp: true
      },
      {
        id: 'vouch-2',
        workerId: 'worker-ramesh-k',
        vouchedByName: 'Brigade Horizon Site Office',
        vouchedByPhone: '+91 97400 44556',
        role: 'Contractor',
        rating: 5,
        workedTogether: true,
        comment: 'Top quality electrical finishing. Follows PPE and safety rules diligently.',
        createdAt: '2026-02-15',
        verifiedOtp: true
      },
      {
        id: 'vouch-3',
        workerId: 'worker-ramesh-k',
        vouchedByName: 'Dr. Anita Rao',
        vouchedByPhone: '+91 99001 88772',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Fixed our persistent tripping issue and inverter breakdown within 2 hours. Very polite.',
        createdAt: '2026-01-20',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 28,
      maxScore: 30,
      levelEarned: 'Gold',
      completedAt: '2026-02-01',
      missingSkills: ['High Voltage Switchgear']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-10T10:00:00Z'
    },
    profileViews: [
      { viewedByCompany: 'ABC Contractors, Bengaluru', viewedAt: '2026-03-15T09:30:00Z' },
      { viewedByCompany: 'Sobha Developers Facility Team', viewedAt: '2026-03-14T14:20:00Z' }
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-03-15'
  },
  {
    id: 'worker-shankar-m',
    name: 'Shankar M.',
    phone: '+91 98765 43211',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Koramangala',
    yearsOfExperience: 6,
    languages: ['ಕನ್ನಡ', 'हिन्दी'],
    availability: 'this_week',
    declaredSkills: ['Industrial Wiring', 'Lighting', 'DB Dressing', 'Single Phase Motor'],
    verifiedSkills: ['Industrial Wiring', 'Lighting', 'DB Dressing'],
    trustScore: 68,
    badgeLevel: 'Silver',
    safetyAware: true,
    assessorVerified: false,
    evidence: [
      {
        id: 'ev-shankar-1',
        workerId: 'worker-shankar-m',
        title: 'Commercial Restaurant Lighting & Panel',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-10 10:00:00',
        location: '5th Block Koramangala',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-s1',
        workerId: 'worker-shankar-m',
        vouchedByName: 'Cafe Terra Supervisor',
        vouchedByPhone: '+91 98451 99001',
        role: 'Client',
        rating: 4,
        workedTogether: true,
        comment: 'Good lighting setup and reliable team member.',
        createdAt: '2026-02-12',
        verifiedOtp: true
      },
      {
        id: 'vouch-s2',
        workerId: 'worker-shankar-m',
        vouchedByName: 'Metro Electricals',
        vouchedByPhone: '+91 98451 99002',
        role: 'Contractor',
        rating: 5,
        workedTogether: true,
        comment: 'Punctual and knows commercial single phase well.',
        createdAt: '2026-01-25',
        verifiedOtp: true
      },
      {
        id: 'vouch-s3',
        workerId: 'worker-shankar-m',
        vouchedByName: 'Karthik N.',
        vouchedByPhone: '+91 98451 99003',
        role: 'Homeowner',
        rating: 4,
        workedTogether: true,
        comment: 'Quick fan and chandelier installation.',
        createdAt: '2026-01-15',
        verifiedOtp: true
      },
      {
        id: 'vouch-s4',
        workerId: 'worker-shankar-m',
        vouchedByName: 'Vittal Prasad',
        vouchedByPhone: '+91 98451 99004',
        role: 'Site Supervisor',
        rating: 4,
        workedTogether: true,
        comment: 'Solid electrician for light commercial work.',
        createdAt: '2025-12-28',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 22,
      maxScore: 30,
      levelEarned: 'Silver',
      completedAt: '2026-01-10',
      missingSkills: ['Inverter Diagnostics', 'Solar Wiring']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-05T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-01'
  },
  {
    id: 'worker-lakshmi-p',
    name: 'Lakshmi P.',
    phone: '+91 98765 43212',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    trade: 'PLUMBER',
    locality: 'HSR Layout',
    yearsOfExperience: 5,
    languages: ['ಕನ್ನಡ', 'हिन्दी', 'English'],
    availability: 'today',
    declaredSkills: ['Pipe Fitting', 'Sanitary Ware', 'Leakage Repair', 'Geyser Installation', 'Water Tank Piping'],
    verifiedSkills: ['Pipe Fitting', 'Sanitary Ware', 'Leakage Repair', 'Geyser Installation'],
    trustScore: 89,
    badgeLevel: 'Gold',
    safetyAware: true,
    assessorVerified: true,
    evidence: [
      {
        id: 'ev-lakshmi-1',
        workerId: 'worker-lakshmi-p',
        title: 'Concealed Diverter & Thermostatic Shower Setup',
        mediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-18 15:30:00',
        location: 'Sector 2 HSR Layout',
        verified: true
      },
      {
        id: 'ev-lakshmi-2',
        workerId: 'worker-lakshmi-p',
        title: 'Pressure Tested CPVC Main Supply Line',
        mediaUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-25 12:00:00',
        location: 'Sector 7 HSR Layout',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-l1',
        workerId: 'worker-lakshmi-p',
        vouchedByName: 'Aditi Varma',
        vouchedByPhone: '+91 99160 55667',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Lakshmi resolved a stubborn hidden pipe leak that three others could not fix. Exceptional skill.',
        createdAt: '2026-02-20',
        verifiedOtp: true
      },
      {
        id: 'vouch-l2',
        workerId: 'worker-lakshmi-p',
        vouchedByName: 'HSR Resident Welfare Association',
        vouchedByPhone: '+91 99160 55668',
        role: 'Client',
        rating: 5,
        workedTogether: true,
        comment: 'Very professional, clean plumbing installations with 0 callbacks.',
        createdAt: '2026-02-01',
        verifiedOtp: true
      },
      {
        id: 'vouch-l3',
        workerId: 'worker-lakshmi-p',
        vouchedByName: 'Gowda Plumbing Solutions',
        vouchedByPhone: '+91 99160 55669',
        role: 'Contractor',
        rating: 5,
        workedTogether: true,
        comment: 'One of the best modern sanitary fixture technicians in south Bengaluru.',
        createdAt: '2026-01-18',
        verifiedOtp: true
      },
      {
        id: 'vouch-l4',
        workerId: 'worker-lakshmi-p',
        vouchedByName: 'Rohan Sharma',
        vouchedByPhone: '+91 99160 55670',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Installed geyser and multi-point diverter smoothly.',
        createdAt: '2026-01-05',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 27,
      maxScore: 30,
      levelEarned: 'Gold',
      completedAt: '2026-01-20',
      missingSkills: ['Sewage Treatment Plant Maintenance']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-02T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-02',
    updatedAt: '2026-03-01'
  },
  {
    id: 'worker-suresh-b',
    name: 'Suresh Babu',
    phone: '+91 98765 43213',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Jayanagar',
    yearsOfExperience: 7,
    languages: ['ಕನ್ನಡ', 'English'],
    availability: 'today',
    declaredSkills: ['House Wiring', 'Submersible Motor', 'Meter Board', 'Earthing'],
    verifiedSkills: ['House Wiring', 'Submersible Motor'],
    trustScore: 62,
    badgeLevel: 'Silver',
    safetyAware: true,
    assessorVerified: false,
    evidence: [],
    vouches: [
      {
        id: 'vouch-sb1',
        workerId: 'worker-suresh-b',
        vouchedByName: 'Pradeep Shenoy',
        vouchedByPhone: '+91 94480 33441',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Fixed borehole pump control panel promptly.',
        createdAt: '2026-02-11',
        verifiedOtp: true
      },
      {
        id: 'vouch-sb2',
        workerId: 'worker-suresh-b',
        vouchedByName: 'Nataraj Builders',
        vouchedByPhone: '+91 94480 33442',
        role: 'Contractor',
        rating: 4,
        workedTogether: true,
        comment: 'Experienced residential wireman.',
        createdAt: '2026-01-28',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 20,
      maxScore: 30,
      levelEarned: 'Silver',
      completedAt: '2026-02-05',
      missingSkills: ['Inverter Diagnostics']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: false,
      consentGiven: true,
      consentTimestamp: '2026-01-15T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-15',
    updatedAt: '2026-02-28'
  },
  {
    id: 'worker-manjunath-r',
    name: 'Manjunath R.',
    phone: '+91 98765 43214',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Electronic City',
    yearsOfExperience: 10,
    languages: ['ಕನ್ನಡ', 'हिन्दी', 'English'],
    availability: 'today',
    declaredSkills: ['Solar Panel Wiring', 'Inverter', 'Three Phase DB', 'Industrial Busbar'],
    verifiedSkills: ['Solar Panel Wiring', 'Inverter', 'Three Phase DB', 'Industrial Busbar'],
    trustScore: 94,
    badgeLevel: 'Gold',
    safetyAware: true,
    assessorVerified: true,
    evidence: [
      {
        id: 'ev-m1',
        workerId: 'worker-manjunath-r',
        title: '5kW On-Grid Rooftop Solar Inverter Integration',
        mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-15 14:00:00',
        location: 'Phase 1 Electronic City',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-m1',
        workerId: 'worker-manjunath-r',
        vouchedByName: 'Infosys Campus Maintenance Lead',
        vouchedByPhone: '+91 98452 77112',
        role: 'Client',
        rating: 5,
        workedTogether: true,
        comment: 'Exceptional mastery in three phase balancing and solar inverters.',
        createdAt: '2026-03-02',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 29,
      maxScore: 30,
      levelEarned: 'Gold',
      completedAt: '2026-01-18',
      missingSkills: []
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-05T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-12'
  },
  {
    id: 'worker-anand-k',
    name: 'Anand Kumar',
    phone: '+91 98765 43215',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Indiranagar',
    yearsOfExperience: 2,
    languages: ['हिन्दी', 'English'],
    availability: 'this_week',
    declaredSkills: ['Fan Fitting', 'Switchboard Replacement', 'Basic Light Fixtures'],
    verifiedSkills: ['Fan Fitting', 'Switchboard Replacement'],
    trustScore: 38,
    badgeLevel: 'Bronze',
    safetyAware: false,
    assessorVerified: false,
    evidence: [],
    vouches: [
      {
        id: 'vouch-ak1',
        workerId: 'worker-anand-k',
        vouchedByName: 'Sunil Mathur',
        vouchedByPhone: '+91 98860 11998',
        role: 'Homeowner',
        rating: 4,
        workedTogether: true,
        comment: 'Replaced living room switchboards quickly.',
        createdAt: '2026-02-14',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 12,
      maxScore: 30,
      levelEarned: 'Bronze',
      completedAt: '2026-02-01',
      missingSkills: ['Distribution Board Dressing', 'Earthing Testing', 'Inverter Wiring']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: false,
      consentGiven: true,
      consentTimestamp: '2026-01-20T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-20',
    updatedAt: '2026-02-15'
  },
  {
    id: 'worker-venkatesh-n',
    name: 'Venkatesh N.',
    phone: '+91 98765 43216',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Whitefield',
    yearsOfExperience: 9,
    languages: ['ಕನ್ನಡ', 'हिन्दी', 'English'],
    availability: 'today',
    declaredSkills: ['Smart Home Automation', 'DB Dressing', 'CCTV Wiring', 'House Wiring'],
    verifiedSkills: ['Smart Home Automation', 'DB Dressing', 'House Wiring'],
    trustScore: 91,
    badgeLevel: 'Gold',
    safetyAware: true,
    assessorVerified: true,
    evidence: [
      {
        id: 'ev-vn1',
        workerId: 'worker-venkatesh-n',
        title: 'KNX Automation Relay Panel & Smart Switches',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-22 17:00:00',
        location: 'Palm Meadows, Whitefield',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-vn1',
        workerId: 'worker-venkatesh-n',
        vouchedByName: 'Rajeev Menon',
        vouchedByPhone: '+91 98453 22334',
        role: 'Client',
        rating: 5,
        workedTogether: true,
        comment: 'Brilliant understanding of modern touch switches and smart modules.',
        createdAt: '2026-02-28',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 28,
      maxScore: 30,
      levelEarned: 'Gold',
      completedAt: '2026-01-15',
      missingSkills: []
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-10T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-10',
    updatedAt: '2026-03-01'
  },
  {
    id: 'worker-raghavendra-g',
    name: 'Raghavendra G.',
    phone: '+91 98765 43217',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Koramangala',
    yearsOfExperience: 4,
    languages: ['ಕನ್ನಡ'],
    availability: 'today',
    declaredSkills: ['House Wiring', 'Earthing', 'Appliance Repair', 'Ceiling Fans'],
    verifiedSkills: ['House Wiring', 'Earthing'],
    trustScore: 58,
    badgeLevel: 'Silver',
    safetyAware: true,
    assessorVerified: false,
    evidence: [],
    vouches: [
      {
        id: 'vouch-rg1',
        workerId: 'worker-raghavendra-g',
        vouchedByName: 'Naveen Kumar',
        vouchedByPhone: '+91 98455 66778',
        role: 'Homeowner',
        rating: 4,
        workedTogether: true,
        comment: 'Good earthing pit work and clean wiring.',
        createdAt: '2026-02-18',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 19,
      maxScore: 30,
      levelEarned: 'Silver',
      completedAt: '2026-02-10',
      missingSkills: ['Inverter Diagnostics']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: false,
      consentGiven: true,
      consentTimestamp: '2026-01-25T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-25',
    updatedAt: '2026-02-20'
  },
  {
    id: 'worker-basavaraj-t',
    name: 'Basavaraj T.',
    phone: '+91 98765 43218',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&auto=format&fit=crop&q=80',
    trade: 'PLUMBER',
    locality: 'Whitefield',
    yearsOfExperience: 8,
    languages: ['ಕನ್ನಡ', 'हिन्दी'],
    availability: 'today',
    declaredSkills: ['CPVC / UPVC Piping', 'Water Tank Fitting', 'RO Installation', 'Booster Pumps'],
    verifiedSkills: ['CPVC / UPVC Piping', 'Water Tank Fitting', 'Booster Pumps'],
    trustScore: 86,
    badgeLevel: 'Gold',
    safetyAware: true,
    assessorVerified: true,
    evidence: [
      {
        id: 'ev-bt1',
        workerId: 'worker-basavaraj-t',
        title: 'Multi-Tank Interconnection with Automatic Float Valves',
        mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        type: 'photo',
        timestamp: '2026-02-14 11:30:00',
        location: 'Kadugodi, Whitefield',
        verified: true
      }
    ],
    vouches: [
      {
        id: 'vouch-bt1',
        workerId: 'worker-basavaraj-t',
        vouchedByName: 'Srinivas Murthy',
        vouchedByPhone: '+91 98801 22331',
        role: 'Client',
        rating: 5,
        workedTogether: true,
        comment: 'Solved overhead tank overflow issue with reliable plumbing.',
        createdAt: '2026-02-25',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 26,
      maxScore: 30,
      levelEarned: 'Gold',
      completedAt: '2026-01-20',
      missingSkills: []
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-01-08T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-08',
    updatedAt: '2026-03-01'
  },
  {
    id: 'worker-deepa-n',
    name: 'Deepa Nayak',
    phone: '+91 98765 43219',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    trade: 'PLUMBER',
    locality: 'Koramangala',
    yearsOfExperience: 4,
    languages: ['ಕನ್ನಡ', 'English'],
    availability: 'this_week',
    declaredSkills: ['Bathroom Fixtures', 'Drainage Lines', 'Tap Repair', 'Water Softener'],
    verifiedSkills: ['Bathroom Fixtures', 'Drainage Lines'],
    trustScore: 64,
    badgeLevel: 'Silver',
    safetyAware: true,
    assessorVerified: false,
    evidence: [],
    vouches: [
      {
        id: 'vouch-dn1',
        workerId: 'worker-deepa-n',
        vouchedByName: 'Divya Balaji',
        vouchedByPhone: '+91 99002 44551',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Very skilled in bathroom fittings and leak rectifications.',
        createdAt: '2026-02-20',
        verifiedOtp: true
      }
    ],
    assessment: {
      score: 21,
      maxScore: 30,
      levelEarned: 'Silver',
      completedAt: '2026-02-08',
      missingSkills: ['High Pressure Booster Pumps']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: false,
      consentGiven: true,
      consentTimestamp: '2026-01-18T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-01-18',
    updatedAt: '2026-02-22'
  },
  {
    id: 'worker-prakash-m',
    name: 'Prakash M.',
    phone: '+91 98765 43220',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    trade: 'PLUMBER',
    locality: 'Jayanagar',
    yearsOfExperience: 1.5,
    languages: ['ಕನ್ನಡ'],
    availability: 'today',
    declaredSkills: ['Basic Pipe Joining', 'Basin Installation', 'Flush Tank Repair'],
    verifiedSkills: ['Basic Pipe Joining'],
    trustScore: 32,
    badgeLevel: 'Bronze',
    safetyAware: false,
    assessorVerified: false,
    evidence: [],
    vouches: [],
    assessment: {
      score: 10,
      maxScore: 30,
      levelEarned: 'Bronze',
      completedAt: '2026-02-05',
      missingSkills: ['CPVC Solvents', 'Underground Drainage', 'Pressure Testing']
    },
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: false,
      consentGiven: true,
      consentTimestamp: '2026-02-01T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-02-01',
    updatedAt: '2026-02-10'
  },
  {
    id: 'worker-demo',
    name: 'Kiran V.',
    phone: '+91 98765 43299',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    trade: 'ELECTRICIAN',
    locality: 'Whitefield',
    yearsOfExperience: 3,
    languages: ['English', 'हिन्दी', 'ಕನ್ನಡ'],
    availability: 'today',
    declaredSkills: ['House Wiring', 'Fans', 'Inverters'],
    verifiedSkills: ['House Wiring'],
    trustScore: 45,
    badgeLevel: 'Silver',
    safetyAware: false,
    assessorVerified: false,
    evidence: [],
    vouches: [
      {
        id: 'vouch-demo-1',
        workerId: 'worker-demo',
        vouchedByName: 'Arun K.',
        vouchedByPhone: '+91 98450 99887',
        role: 'Homeowner',
        rating: 5,
        workedTogether: true,
        comment: 'Great work replacing living room lighting and inverter.',
        createdAt: '2026-02-28',
        verifiedOtp: true
      }
    ],
    assessment: undefined,
    privacySettings: {
      showPhone: true,
      showLocation: true,
      showVideos: true,
      consentGiven: true,
      consentTimestamp: '2026-03-01T10:00:00Z'
    },
    profileViews: [],
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01'
  }
];

export const INITIAL_EMPLOYERS: EmployerProfile[] = [
  {
    id: 'emp-abc',
    companyName: 'ABC Contractors, Bengaluru',
    contactPerson: 'Arun Bhat',
    type: 'contractor',
    locality: 'Whitefield',
    shortlistedWorkerIds: ['worker-ramesh-k']
  }
];

export const INITIAL_JOB_REQUESTS: JobRequest[] = [
  {
    id: 'job-1',
    employerId: 'emp-abc',
    employerName: 'ABC Contractors, Bengaluru',
    trade: 'ELECTRICIAN',
    locality: 'Whitefield',
    requiredWorkers: 2,
    duration: '3 Days (Full Time)',
    dailyWageOffer: 1200,
    description: 'Conduit wiring and distribution board dressing for a 4-unit row villa project near Hope Farm.',
    createdAt: '2026-03-12 10:00:00',
    status: 'open',
    responses: [
      {
        workerId: 'worker-ramesh-k',
        status: 'pending'
      }
    ]
  },
  {
    id: 'job-2',
    employerId: 'emp-abc',
    employerName: 'ABC Contractors, Bengaluru',
    trade: 'PLUMBER',
    locality: 'HSR Layout',
    requiredWorkers: 1,
    duration: '1 Day Emergency',
    dailyWageOffer: 1350,
    description: 'Bathroom sanitary fixture alignment and concealed leak detection.',
    createdAt: '2026-03-14 09:15:00',
    status: 'open',
    responses: [
      {
        workerId: 'worker-lakshmi-p',
        status: 'accepted',
        respondedAt: '2026-03-14 10:00:00'
      }
    ]
  }
];

export const WAGE_ESTIMATES: WageEstimate[] = [
  { trade: 'ELECTRICIAN', level: 'Bronze', locality: 'Whitefield', minDailyWage: 650, maxDailyWage: 800, avgDailyWage: 720 },
  { trade: 'ELECTRICIAN', level: 'Silver', locality: 'Whitefield', minDailyWage: 850, maxDailyWage: 1100, avgDailyWage: 950 },
  { trade: 'ELECTRICIAN', level: 'Gold', locality: 'Whitefield', minDailyWage: 1200, maxDailyWage: 1600, avgDailyWage: 1350 },
  { trade: 'PLUMBER', level: 'Bronze', locality: 'HSR Layout', minDailyWage: 650, maxDailyWage: 800, avgDailyWage: 700 },
  { trade: 'PLUMBER', level: 'Silver', locality: 'HSR Layout', minDailyWage: 900, maxDailyWage: 1150, avgDailyWage: 1000 },
  { trade: 'PLUMBER', level: 'Gold', locality: 'HSR Layout', minDailyWage: 1250, maxDailyWage: 1650, avgDailyWage: 1400 },
];

export const GOV_SCHEMES = [
  {
    id: 'eshram',
    name: 'e-Shram Portal (Ministry of Labour & Employment)',
    benefits: 'Accidental insurance cover of ₹2 Lakh (PMSBY) + National Universal Account Number (UAN)',
    whyQualify: 'As an active unorganized worker in the electrical or plumbing trade with Aadhaar linkage.',
    link: 'https://eshram.gov.in'
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    benefits: '₹15,000 tool kit incentive + 5% subsidized collateral-free enterprise loan up to ₹3 Lakh',
    whyQualify: 'Qualifies under traditional artisan and skilled technician trade categories.',
    link: 'https://pmvishwakarma.gov.in'
  },
  {
    id: 'skill-india',
    name: 'Skill India Digital / Recognition of Prior Learning (RPL)',
    benefits: 'Government recognized NSQF certification without formal schooling + ₹500 stipend',
    whyQualify: 'You have 3+ years of on-ground experience ready for formal NSQF Level 4 assessment.',
    link: 'https://www.skillindiadigital.gov.in'
  }
];

export const TRANSFERABLE_SKILLS_MAP: Record<Trade, { source: string; target: string; rationale: string }[]> = {
  ELECTRICIAN: [
    {
      source: 'Residential Electrician',
      target: 'Maintenance Technician (Facilities)',
      rationale: 'Knowledge of single-phase distribution, breakers, and earthing translates directly to commercial facility upkeep.'
    },
    {
      source: 'Electrical Helper',
      target: 'Junior Electrician',
      rationale: 'On-site experience pulling conduit wiring qualifies for independent switchboard work.'
    },
    {
      source: 'Inverter & Battery Wiring',
      target: 'Solar Rooftop Installer',
      rationale: 'DC cabling, inverter synchronization, and safety disconnects share identical engineering principles.'
    }
  ],
  PLUMBER: [
    {
      source: 'General Pipe Fitter',
      target: 'Fire Sprinkler System Technician',
      rationale: 'Pressure testing, high-durability CPVC joints, and blueprint reading directly apply to fire suppression.'
    },
    {
      source: 'Plumbing Helper',
      target: 'Junior Plumber / Sanitary Fitter',
      rationale: 'Familiarity with trench digging, pipe threading, and standard fittings provides strong foundation.'
    },
    {
      source: 'Drainage & Pump Technician',
      target: 'STP (Sewage Treatment Plant) Operator',
      rationale: 'Submersible sludge pumps and non-return valves are primary STP equipment.'
    }
  ]
};
